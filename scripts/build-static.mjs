import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
export async function buildStatic({directory,prefix='',siteUrl,dataFile,pages=false}) {
const root=process.cwd(),stage=path.join(root,directory);
const siteOrigin=new URL(siteUrl).origin;
// Disposable build workspace, never the application, database or media source.
if(path.dirname(stage)!==root||!['.pages-build','.netlify-build'].includes(path.basename(stage)))throw new Error('Unsafe build path');
await fs.rm(stage,{recursive:true,force:true});await fs.mkdir(stage,{recursive:true});
for(const dir of ['components','data'])await fs.cp(dir,path.join(stage,dir),{recursive:true});
await fs.mkdir(path.join(stage,'lib'),{recursive:true});
await fs.copyFile('lib/contact.ts',path.join(stage,'lib/contact.ts'));
await fs.copyFile('package.json',path.join(stage,'package.json'));
await fs.copyFile('package-lock.json',path.join(stage,'package-lock.json'));
const ts=JSON.parse(await fs.readFile('tsconfig.json','utf8'));delete ts.compilerOptions.paths['@payload-config'];
await fs.writeFile(path.join(stage,'tsconfig.json'),JSON.stringify(ts,null,2));
await fs.writeFile(path.join(stage,'next.config.mjs'),`export default {output:'export',${prefix ? `basePath:${JSON.stringify(prefix)},assetPrefix:${JSON.stringify(prefix)},` : ''}trailingSlash:true,images:{unoptimized:true},turbopack:{root:${JSON.stringify(root)}}};`);
const data=JSON.parse(await fs.readFile(dataFile,'utf8'));
const files=new Set();
for(const projects of Object.values(data))for(const p of projects){
 for(const key of ['cover','coverVideo','heroVideo'])if(p[key]){
  const asset=!pages&&key!=='cover'?p[key].replace('/portfolio/web/','/portfolio/web/optimized/'):p[key];
  files.add(asset);p[key]=prefix+asset;
 }
 p.gallery=p.gallery.map(u=>{files.add(u);return prefix+u;});
 p.additionalVideos=p.additionalVideos.map(v=>{for(const k of ['src','poster'])if(v[k]){files.add(v[k]);v[k]=prefix+v[k];}return v;});
}
await fs.writeFile(path.join(stage,'data/pages-projects.json'),JSON.stringify(data));
await fs.cp('public/brand',path.join(stage,'public/brand'),{recursive:true});
await fs.cp('public/media',path.join(stage,'public/media'),{recursive:true});
await fs.cp('public/fonts',path.join(stage,'public/fonts'),{recursive:true});
if (!pages && process.env.NETLIFY === 'true') {
 const include=[...files].filter(file=>file.endsWith('.mp4')).map(file=>'public'+file).join(',');
 const fetchMedia=spawnSync('git',['lfs','pull','--include='+include,'--exclude='],{stdio:'inherit'});
 if(fetchMedia.status!==0)throw new Error('Could not fetch public Git LFS videos');
}
for(const file of files){
 const source=path.join(root,'public',file);const handle=await fs.open(source);const buf=Buffer.alloc(128);await handle.read(buf,0,128,0);await handle.close();
 if(buf.toString().startsWith('version https://git-lfs.github.com/spec'))throw new Error(`LFS pointer instead of media: ${file}. Run git lfs pull.`);
 const target=path.join(stage,'public',file);await fs.mkdir(path.dirname(target),{recursive:true});await fs.copyFile(source,target);
}
const frontend='app/(frontend)';
for(const locale of ['ru','en']){
 const group=path.join(stage,'app',`(${locale})`);await fs.mkdir(group,{recursive:true});
 const transform=s=>s.replaceAll("@/lib/i18n",`@/lib/i18n-${locale}`).replaceAll("@/lib/projects",`@/lib/projects-${locale}`).replaceAll("@/components/sections",`@/components/sections-${locale}`).replaceAll("export const dynamic='force-dynamic';",'');
 const layout=transform(await fs.readFile(`${frontend}/layout.tsx`,'utf8')).replace("import './globals.css'","import '../globals.css'");
 await fs.writeFile(path.join(group,'layout.tsx'),layout);
 for(const entry of await fs.readdir(frontend,{recursive:true,withFileTypes:true})){
  if(!entry.isFile()||entry.name!=='page.tsx')continue;
  const source=path.join(entry.parentPath,entry.name),relative=path.relative(frontend,source);
  let code=transform(await fs.readFile(source,'utf8'));
  if(!pages)code=code.replaceAll('src={hero.heroVideo}', 'src={hero.coverVideo}').replaceAll('src={hero?.heroVideo}', 'src={hero?.coverVideo}').replace('src={projects[0]?.heroVideo}', 'src={projects[0]?.coverVideo}');
  const route='/'+path.dirname(relative).replaceAll('\\','/').replace(/^\.$/,'');
  if(relative.includes('[slug]')){const section=relative.startsWith('studio')?'studio':'multstory';code+=`\nexport function generateStaticParams(){return ${JSON.stringify(data[locale].filter(p=>p.section===section).map(p=>({slug:p.slug})))};}\n`;}
  // Metadata for non-dynamic pages has an explicit static path.
  else code=code.replace('export async function generateMetadata()',`const staticPath=${JSON.stringify(route)};\nexport async function generateMetadata()`).replaceAll('return localizedMetadata(', 'return pageMetadata(').replaceAll('return {...await localizedMetadata(', 'return {...await pageMetadata(')+`\nfunction pageMetadata(title?:string,description?:string){return localizedMetadata(title,description,${JSON.stringify(route)});}\n`;
  const target=path.join(group,locale,relative);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,code);
 }
 let sections=transform(await fs.readFile('components/sections.tsx','utf8'));
 if(!pages)sections=sections.replace('src={p.heroVideo} alt={p.coverAlt}', 'src={p.coverVideo} alt={p.coverAlt}');
 await fs.writeFile(path.join(stage,`components/sections-${locale}.tsx`),sections);
 await fs.writeFile(path.join(stage,`lib/projects-${locale}.ts`),`import data from '@/data/pages-projects.json';import type {Project,Section} from '@/data/projects';const projects=data.${locale} as Project[];export async function getProjects(section?:Section){return section?projects.filter(p=>p.section===section):projects;}export async function getProject(section:Section,slug:string){const list=await getProjects(section),i=list.findIndex(p=>p.slug===slug);return {project:list[i],next:list[(i+1)%list.length]};}`);
 await fs.writeFile(path.join(stage,`lib/i18n-${locale}.ts`),`import type {Metadata} from 'next';import {dictionaries} from '@/data/translations';export async function getLocale():Promise<'ru'|'en'>{return '${locale}';}export async function getDictionary(){return dictionaries.${locale};}export async function localizedMetadata(title?:string,description?:string,path='/'):Promise<Metadata>{const d=dictionaries.${locale},suffix=path==='/'?'':path.replace(/\\/$/,'');return {metadataBase:new URL(${JSON.stringify(siteOrigin)}),title:title||d.seoTitle,description:description||d.seoDescription,alternates:{canonical:'${prefix}/${locale}'+suffix+'/',languages:{ru:'${prefix}/ru'+suffix+'/',en:'${prefix}/en'+suffix+'/'}},openGraph:{type:'website',url:'${prefix}/${locale}'+suffix+'/',locale:${JSON.stringify(locale==='ru'?'ru_RU':'en_US')},title:title||d.seoTitle,description:description||d.seoDescription,images:['${prefix}/brand/mascot/mascot-home-hero.webp']}};}`);
}
const css=await fs.readFile(`${frontend}/globals.css`,'utf8');
await fs.writeFile(path.join(stage,'app/globals.css'),css.replaceAll('/fonts/',prefix+'/fonts/'));
// Remove copied server-only source; locale-specialized modules above serve export.
await fs.rm(path.join(stage,'components/sections.tsx'));
for(const entry of await fs.readdir(stage,{recursive:true,withFileTypes:true})){
 if(!entry.isFile()||!entry.name.endsWith('.tsx'))continue;
 const file=path.join(entry.parentPath,entry.name);let s=await fs.readFile(file,'utf8');
 s=s.replaceAll('/brand/',prefix+'/brand/').replaceAll('/media/home/',prefix+'/media/home/');
 if(entry.name==='locale.tsx')s=s.replace('href={`/${l}${path}`}','href={`'+prefix+'/${l}${path}`}');
 if(pages && entry.name==='media.tsx')s=s.replace('ref={video} src={priority?src:undefined}','ref={video} onTimeUpdate={hover?event=>{if(event.currentTarget.currentTime>=8)event.currentTarget.currentTime=0;}:undefined} src={priority?src:undefined}');
 await fs.writeFile(file,s);
}
await fs.mkdir(path.join(stage,'app/(entry)'),{recursive:true});
await fs.writeFile(path.join(stage,'app/(entry)/layout.tsx'),`export default function Layout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>}`);
await fs.writeFile(path.join(stage,'app/(entry)/page.tsx'),`export default function Page(){return <><meta httpEquiv="refresh" content="0;url=${prefix}/ru/"/><a href="${prefix}/ru/">KREOMORA</a></>}`);
const build=spawnSync(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'build',stage],{stdio:'inherit',env:{...process.env,NEXT_PUBLIC_SITE_URL:siteUrl,NEXT_PUBLIC_SITE_BASE_PATH:prefix}});
if(build.status!==0)process.exit(build.status||1);
const out=path.join(stage,'out');await fs.writeFile(path.join(out,'.nojekyll'),'');
// Preserve legacy non-locale links as static redirects, including deep project URLs.
for(const route of ['studio','studio/work','multstory','multstory/stories','about','contact',...data.ru.map(p=>`${p.section}/${p.slug}`)]){
 const dir=path.join(out,route);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'index.html'),`<!doctype html><html lang="ru"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${prefix}/ru/${route}/"><title>KREOMORA</title><a href="${prefix}/ru/${route}/">KREOMORA</a></html>`);
}
if(!pages){
 const routes=['','studio','studio/work','multstory','multstory/stories','about','contact',
  ...data.ru.map(project=>`${project.section}/${project.slug}`)];
 const urls=['ru','en'].flatMap(locale=>routes.map(route=>{
  const suffix=route?'/'+route+'/':'/';
  return `  <url><loc>${siteOrigin}/${locale}${suffix}</loc></url>`;
 }));
 await fs.writeFile(path.join(out,'sitemap.xml'),['<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',...urls,'</urlset>',''].join('\n'));
 await fs.writeFile(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`);
 await fs.writeFile(path.join(out,'404.html'),`<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>404 — KREOMORA</title><link rel="icon" href="/brand/kreomora-logo-dark.png">
<style>
@font-face{font-family:Manrope;src:url('/fonts/Manrope.ttf') format('truetype');font-display:swap}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#111210;color:#f0eee7;font:1rem Manrope,Arial,sans-serif}
main{padding:2rem;width:min(80%,42rem)}img{width:110px;height:auto}h1{font-size:clamp(2rem,8vw,5rem);line-height:1}a{color:inherit;text-underline-offset:.4em;display:inline-block;margin:1rem 1rem 0 0}a:focus-visible{outline:2px solid #e4a980;outline-offset:6px}
</style></head><body><main><img src="/brand/kreomora-logo-light.png" alt="KREOMORA"><h1>Страница не найдена</h1>
<p lang="en">Page not found</p><a href="/ru/">На главную ↗</a><a href="/en/" lang="en">Back home ↗</a></main></body></html>`);
}
let bytes=0;for(const e of await fs.readdir(out,{recursive:true,withFileTypes:true}))if(e.isFile())bytes+=(await fs.stat(path.join(e.parentPath,e.name))).size;
console.log(`Static export: ${out}; ${bytes} bytes; ${files.size} unique portfolio assets.`);
if(pages && bytes>=1_000_000_000)throw new Error('Pages export exceeds conservative 1 GB cap');
}

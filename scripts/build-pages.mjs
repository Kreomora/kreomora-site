import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const root=process.cwd(),stage=path.join(root,'.pages-build'),prefix='/kreomora-site';
// Disposable build workspace, never the application, database or media source.
if(path.dirname(stage)!==root||path.basename(stage)!=='.pages-build')throw new Error('Unsafe build path');
await fs.rm(stage,{recursive:true,force:true});await fs.mkdir(stage,{recursive:true});
for(const dir of ['components','data'])await fs.cp(dir,path.join(stage,dir),{recursive:true});
await fs.mkdir(path.join(stage,'lib'),{recursive:true});
await fs.copyFile('lib/contact.ts',path.join(stage,'lib/contact.ts'));
await fs.copyFile('package.json',path.join(stage,'package.json'));
await fs.copyFile('package-lock.json',path.join(stage,'package-lock.json'));
const ts=JSON.parse(await fs.readFile('tsconfig.json','utf8'));delete ts.compilerOptions.paths['@payload-config'];
await fs.writeFile(path.join(stage,'tsconfig.json'),JSON.stringify(ts,null,2));
await fs.writeFile(path.join(stage,'next.config.mjs'),`export default {output:'export',basePath:'${prefix}',assetPrefix:'${prefix}',trailingSlash:true,images:{unoptimized:true},turbopack:{root:${JSON.stringify(root)}}};`);
const data=JSON.parse(await fs.readFile('data/pages-projects.json','utf8'));
const files=new Set();
for(const projects of Object.values(data))for(const p of projects){
 for(const key of ['cover','coverVideo','heroVideo'])if(p[key]){files.add(p[key]);p[key]=prefix+p[key];}
 p.gallery=p.gallery.map(u=>{files.add(u);return prefix+u;});
 p.additionalVideos=p.additionalVideos.map(v=>{for(const k of ['src','poster'])if(v[k]){files.add(v[k]);v[k]=prefix+v[k];}return v;});
}
await fs.writeFile(path.join(stage,'data/pages-projects.json'),JSON.stringify(data));
await fs.cp('public/brand',path.join(stage,'public/brand'),{recursive:true});
await fs.cp('public/media',path.join(stage,'public/media'),{recursive:true});
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
  const route='/'+path.dirname(relative).replaceAll('\\','/').replace(/^\.$/,'');
  if(relative.includes('[slug]')){const section=relative.startsWith('studio')?'studio':'multstory';code+=`\nexport function generateStaticParams(){return ${JSON.stringify(data[locale].filter(p=>p.section===section).map(p=>({slug:p.slug})))};}\n`;}
  // Metadata for non-dynamic pages has an explicit static path.
  else code=code.replace('export async function generateMetadata()',`const staticPath=${JSON.stringify(route)};\nexport async function generateMetadata()`).replaceAll('return localizedMetadata(', 'return pageMetadata(').replaceAll('return {...await localizedMetadata(', 'return {...await pageMetadata(')+`\nfunction pageMetadata(title?:string,description?:string){return localizedMetadata(title,description,${JSON.stringify(route)});}\n`;
  const target=path.join(group,locale,relative);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,code);
 }
 const sections=transform(await fs.readFile('components/sections.tsx','utf8'));
 await fs.writeFile(path.join(stage,`components/sections-${locale}.tsx`),sections);
 await fs.writeFile(path.join(stage,`lib/projects-${locale}.ts`),`import data from '@/data/pages-projects.json';import type {Project,Section} from '@/data/projects';const projects=data.${locale} as Project[];export async function getProjects(section?:Section){return section?projects.filter(p=>p.section===section):projects;}export async function getProject(section:Section,slug:string){const list=await getProjects(section),i=list.findIndex(p=>p.slug===slug);return {project:list[i],next:list[(i+1)%list.length]};}`);
 await fs.writeFile(path.join(stage,`lib/i18n-${locale}.ts`),`import type {Metadata} from 'next';import {dictionaries} from '@/data/translations';export async function getLocale():Promise<'ru'|'en'>{return '${locale}';}export async function getDictionary(){return dictionaries.${locale};}export async function localizedMetadata(title?:string,description?:string,path='/'):Promise<Metadata>{const d=dictionaries.${locale},suffix=path==='/'?'':path.replace(/\\/$/,'');return {metadataBase:new URL('https://kreomora.github.io'),title:title||d.seoTitle,description:description||d.seoDescription,alternates:{canonical:'${prefix}/${locale}'+suffix+'/',languages:{ru:'${prefix}/ru'+suffix+'/',en:'${prefix}/en'+suffix+'/'}},openGraph:{title:title||d.seoTitle,description:description||d.seoDescription,images:['${prefix}/brand/mascot/mascot-home-hero.webp']}};}`);
}
await fs.copyFile(`${frontend}/globals.css`,path.join(stage,'app/globals.css'));
// Remove copied server-only source; locale-specialized modules above serve export.
await fs.rm(path.join(stage,'components/sections.tsx'));
for(const entry of await fs.readdir(stage,{recursive:true,withFileTypes:true})){
 if(!entry.isFile()||!entry.name.endsWith('.tsx'))continue;
 const file=path.join(entry.parentPath,entry.name);let s=await fs.readFile(file,'utf8');
 s=s.replaceAll('/brand/',prefix+'/brand/').replaceAll('/media/home/',prefix+'/media/home/');
 if(entry.name==='locale.tsx')s=s.replace('href={`/${l}${path}`}','href={`'+prefix+'/${l}${path}`}');
 if(entry.name==='media.tsx')s=s.replace('ref={video} src={src}','ref={video} onTimeUpdate={hover?event=>{if(event.currentTarget.currentTime>=8)event.currentTarget.currentTime=0;}:undefined} src={src}');
 await fs.writeFile(file,s);
}
await fs.mkdir(path.join(stage,'app/(entry)'),{recursive:true});
await fs.writeFile(path.join(stage,'app/(entry)/layout.tsx'),`export default function Layout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>}`);
await fs.writeFile(path.join(stage,'app/(entry)/page.tsx'),`export default function Page(){return <><meta httpEquiv="refresh" content="0;url=${prefix}/ru/"/><a href="${prefix}/ru/">KREOMORA</a></>}`);
const build=spawnSync(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'build',stage],{stdio:'inherit',env:{...process.env,NEXT_PUBLIC_SITE_URL:'https://kreomora.github.io/kreomora-site'}});
if(build.status!==0)process.exit(build.status||1);
const out=path.join(stage,'out');await fs.writeFile(path.join(out,'.nojekyll'),'');
// Preserve legacy non-locale links as static redirects, including deep project URLs.
for(const route of ['studio','studio/work','multstory','multstory/stories','about','contact',...data.ru.map(p=>`${p.section}/${p.slug}`)]){
 const dir=path.join(out,route);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'index.html'),`<!doctype html><html lang="ru"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${prefix}/ru/${route}/"><title>KREOMORA</title><a href="${prefix}/ru/${route}/">KREOMORA</a></html>`);
}
let bytes=0;for(const e of await fs.readdir(out,{recursive:true,withFileTypes:true}))if(e.isFile())bytes+=(await fs.stat(path.join(e.parentPath,e.name))).size;
console.log(`Static export: ${out}; ${bytes} bytes; ${files.size} unique portfolio assets.`);
if(bytes>=1_000_000_000)throw new Error('Pages export exceeds conservative 1 GB cap');

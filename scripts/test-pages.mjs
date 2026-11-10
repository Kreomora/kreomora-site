import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const netlify=process.argv.includes('--netlify');
const out=netlify?'.netlify-build/out':'.pages-build/out',base=netlify?'':'/kreomora-site';
await fs.access(path.join(out,'index.html'));
const data=JSON.parse(await fs.readFile(netlify?'data/portfolio.json':'data/pages-projects.json','utf8'));
let count=0;const assets=new Set();
for(const locale of ['ru','en'])for(const route of ['', 'studio','studio/work','multstory','multstory/stories','about','contact',...data[locale].map(p=>`${p.section}/${p.slug}`)]){
 const file=path.join(out,locale,route,'index.html'),html=await fs.readFile(file,'utf8');count++;
 if(netlify){
  assert(!html.includes('/kreomora-site/')&&!html.includes('kreomora.github.io'),file+' GitHub Pages URL');
  for(const match of html.matchAll(/<video\b[^>]*>/g)){
   const tag=match[0];
   if(/\ssrc=/.test(tag))assert(tag.includes('/portfolio/web/optimized/')&&tag.includes('-card-hq.mp4'),file+' eager full film');
  }
 }
 assert(html.includes(`<html lang="${locale}"`),file+' lang');assert(!html.includes('/api/media/'),file+' runtime media');
 assert(!html.includes('href="#"'));assert(!/<form\b/.test(html));
 const urls=[...html.matchAll(/(?:href|src|poster)="([^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&'));
 for(const u of urls){
  if(u.startsWith('https://t.me/'))assert(new URL(u).searchParams.get('text'));
  if(u.startsWith('mailto:')){assert(new URL(u).searchParams.get('subject'));assert(new URL(u).searchParams.get('body'));}
  if(!u.startsWith('/')||u.startsWith('//'))continue;
  assert(u.startsWith(base+'/'),file+' incorrect base path '+u);
  let target=path.join(out,decodeURIComponent(u.slice(base.length).split(/[?#]/)[0]));
  try{const stat=await fs.stat(target);if(stat.isDirectory())target=path.join(target,'index.html');await fs.access(target);}catch{throw new Error(file+' missing '+u);}
  assets.add(target);
 }
}
// Lazy video sources are serialized as props rather than HTML src attributes.
const videos=[...new Set(data.ru.flatMap(project=>[project.coverVideo,project.heroVideo]))].map(url=>path.join(out,netlify?url.replace('/portfolio/web/','/portfolio/web/optimized/'):url));
assert.equal(videos.length,netlify?36:18);
for(const file of videos){const f=await fs.open(file);const buffer=Buffer.alloc(64);await f.read(buffer,0,64,0);await f.close();assert(!buffer.toString().startsWith('version https://git-lfs'));assert(buffer.toString('ascii',4,8)==='ftyp',file+' MP4 header');}
for(const entry of ['admin','api'])await assert.rejects(fs.access(path.join(out,entry)));
console.log(`PASS: ${count} localized pages; ${assets.size} internal link/asset targets; ${videos.length} real MP4s; contacts, prefix, HTML language, no API/admin/forms.`);

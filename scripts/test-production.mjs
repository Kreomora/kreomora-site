import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const portfolio=JSON.parse(await fs.readFile('data/portfolio.json','utf8'));
const routes=JSON.parse(await fs.readFile('.next/server/app-paths-manifest.json','utf8'));
assert(Object.keys(routes).some(route=>route.endsWith('/studio/[slug]/page')));
assert(Object.keys(routes).some(route=>route.endsWith('/multstory/[slug]/page')));
assert(!Object.keys(routes).some(route=>/\/(admin|api)(\/|$)/.test(route)),'CMS route in production');
const media=new Set();
for(const locale of ['ru','en']){
 const projects=portfolio[locale];
 assert.equal(projects.length,18);
 assert.equal(projects.filter(p=>p.section==='studio').length,6);
 assert.equal(projects.filter(p=>p.section==='multstory').length,12);
 assert.equal(new Set(projects.map(p=>p.slug)).size,18);
 for(const p of projects){
  assert(!p.placeholder);
  for(const value of [p.cover,p.coverVideo,p.heroVideo,...p.gallery,...p.additionalVideos.flatMap(v=>[v.src,v.poster])].filter(Boolean)){
   assert(value.startsWith('/portfolio/web/'),'Non-static media: '+value);
   const file=path.join('public',value);await fs.access(file);media.add(file);
  }
 }
}
for(const file of media){
 if(!file.endsWith('.mp4'))continue;
 const handle=await fs.open(file);const header=Buffer.alloc(64);
 await handle.read(header,0,64,0);await handle.close();
 assert.equal(header.toString('ascii',4,8),'ftyp','Real MP4 required: '+file);
}
let traces=0;
for(const entry of await fs.readdir('.next',{recursive:true,withFileTypes:true})){
 if(!entry.isFile()||!entry.name.endsWith('.nft.json'))continue;
 const file=path.join(entry.parentPath,entry.name);
 if(file.split(path.sep).includes('dev'))continue;
 const trace=JSON.parse(await fs.readFile(file,'utf8'));traces++;
 for(const dependency of trace.files){
  const normalized=dependency.replaceAll('\\','/');
  assert(!/node_modules\/(?:@payloadcms\/|payload\/|@libsql\/|libsql\/|better-sqlite3\/)|payload\.config|payload-types|\/storage\//.test(normalized),file+' includes '+dependency);
 }
}
assert(traces>0);
console.log(`PASS: ${traces} production traces without Payload/database/storage; no admin/API routes; 18 bilingual projects; ${media.size} unchanged public assets.`);

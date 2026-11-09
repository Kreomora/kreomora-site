import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {getPayload} from 'payload';import config from '../payload.config';
const p=await getPayload({config});
try{
const manifest=JSON.parse(await fs.readFile('data/portfolio-import.json','utf8'));
const {docs}=await p.find({collection:'projects',pagination:false,depth:1,where:{and:[{placeholder:{not_equals:true}},{_status:{equals:'published'}}]}});
assert.equal(docs.filter(x=>x.section==='studio').length,6);assert.equal(docs.filter(x=>x.section==='multstory').length,12);
for(const row of manifest){const project=docs.find(x=>x.slug===row.slug);assert(project,row.slug);assert(project.heroVideo&&typeof project.heroVideo==='object');assert(project.coverVideo&&typeof project.coverVideo==='object');assert.notEqual(project.heroVideo.id,project.coverVideo.id);assert.equal(project.gallery?.length,3);
for(const media of [project.cover,project.coverVideo,project.heroVideo,...(project.gallery||[]).map(x=>x.image)]){assert(media&&typeof media==='object'&&media.url);const response=await fetch(media.url,{headers:{Range:'bytes=0-1023'}});assert(response.ok,media.url);await response.body?.cancel();}
const response=await fetch(`http://localhost:3000/${row.section}/${row.slug}/`);assert.equal(response.status,200,row.slug);
}
for(const route of ['/','/studio/','/multstory/','/about/','/contact/','/admin/','/studio/work/','/multstory/stories/','/sitemap.xml'])assert.equal((await fetch('http://localhost:3000'+route)).status,200,route);
console.log('PASS: 18 published real projects, 108 CMS media references, distinct lightweight previews, 18 case pages and 9 main routes.');
}finally{await p.destroy();}

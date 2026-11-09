import fs from 'node:fs/promises';
import path from 'node:path';
import {getPayload} from 'payload';
import config from '../payload.config';
const rows=JSON.parse(await fs.readFile('data/video-quality.json','utf8'));
const payload=await getPayload({config});
async function media(url:string,alt:string){const filename=path.basename(url);const existing=await payload.find({collection:'media',where:{filename:{equals:filename}},limit:1});if(existing.docs[0])return existing.docs[0].id;return (await payload.create({collection:'media',data:{alt,visibility:'public'},filePath:path.resolve('public',url.slice(1))})).id;}
try{for(const row of rows){const {docs}=await payload.find({collection:'projects',where:{slug:{equals:row.slug}},limit:1,depth:1});const p=docs[0];if(!p)throw new Error(`Missing project ${row.slug}`);
 const heroVideo=await media(row.web,row.title+' — full source quality'),coverVideo=await media(row.card,row.title+' — high quality card clip'),cover=await media(row.poster,row.title+' — native resolution poster');
 const gallery=[];for(const frame of row.gallery)gallery.push({image:await media(frame,row.title+' — source film still')});
 await payload.update({collection:'projects',id:p.id,data:{heroVideo,coverVideo,cover,gallery}});
 console.log(`HQ media attached: ${row.slug}`);
}}finally{await payload.destroy();}

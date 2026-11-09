import fs from 'node:fs/promises';
import sharp from 'sharp';
import {getPayload} from 'payload';
import config from '../payload.config';
import type {Project} from '../payload-types';
const rows=JSON.parse(await fs.readFile('cms/seed/legacy-projects.json','utf8'));
const payload=await getPayload({config});
try{for(const row of rows){const existing=await payload.find({collection:'projects',where:{slug:{equals:row.slug}},limit:1});if(existing.totalDocs)continue;
 const uploads=[];
 for(const name of ['cover','frame-01','frame-02']){const buffer=await sharp(await fs.readFile(`${row.legacyDirectory}/${name}.svg`)).webp({quality:85}).toBuffer();const uploaded=await payload.create({collection:'media',data:{alt:`${row.title} — abstract ${name} placeholder`,visibility:'public'},file:{data:buffer,mimetype:'image/webp',name:`${row.slug}-${name}.webp`,size:buffer.length}});uploads.push(uploaded.id);}
 const {legacyDirectory:_,...data}=row;void _;
 await payload.create({collection:'projects',data:{...data,cover:uploads[0],gallery:uploads.slice(1).map(image=>({image})),_status:'published'} as Omit<Project,'id'|'createdAt'|'updatedAt'>});console.log(`Imported ${row.slug}`);
}}finally{await payload.destroy();}

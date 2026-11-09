import fs from 'node:fs/promises';
import path from 'node:path';
import {getPayload} from 'payload';
import config from '../payload.config';
const rows=JSON.parse(await fs.readFile('data/portfolio-import.json','utf8'));
const payload=await getPayload({config});
async function upload(url:string,alt:string){
 const filename=url.includes('/previews/')?path.basename(url).replace('.mp4','-preview.mp4'):path.basename(url);
 const existing=await payload.find({collection:'media',where:{filename:{equals:filename}},limit:1});
 if(existing.docs[0])return existing.docs[0].id;
 const data=await fs.readFile(path.resolve('public',url.slice(1)));
 return (await payload.create({collection:'media',data:{alt,visibility:'public'},file:{data,name:filename,size:data.length,mimetype:filename.endsWith('.mp4')?'video/mp4':'image/jpeg'}})).id;
}
try{for(const [index,row] of rows.entries()){
 const existing=await payload.find({collection:'projects',where:{slug:{equals:row.slug}},limit:1});
 if(existing.docs[0]&&!existing.docs[0].placeholder){
  const current=existing.docs[0];
  const id=(value:unknown)=>typeof value==='object'&&value!==null&&'id' in value?value.id:value;
  if(id(current.coverVideo)===id(current.heroVideo))await payload.update({collection:'projects',id:current.id,data:{coverVideo:await upload(row.preview,row.title+' — silent preview')}});
  console.log('Already imported: '+row.slug);continue;
 }
 // Keep a colliding legacy placeholder intact under its own archive slug.
 if(existing.docs[0]?.placeholder)await payload.update({collection:'projects',id:existing.docs[0].id,data:{slug:`legacy-${row.slug}-${existing.docs[0].id}`}});
 const cover=await upload(row.poster,row.title),heroVideo=await upload(row.video,row.title+' — full film'),coverVideo=await upload(row.preview,row.title+' — silent preview');
 const gallery=[];for(const frame of row.gallery)gallery.push({image:await upload(frame,row.title+' — film still')});
 await payload.create({collection:'projects',data:{title:row.title,slug:row.slug,section:row.section,subtitle:row.category,category:[{value:row.category}],year:2026,description:row.section==='studio'?'Commercial imagination, brought into motion.':'A personal story, brought to life through animation.',services:[{value:row.category}],cover,coverVideo,heroVideo,gallery,theme:row.section==='studio'?'dark':'warm',featured:[0,2,6,8,15,16].includes(index),displayOrder:(index+1)*10,placeholder:false,_status:'published'}});
 console.log('Imported '+row.slug);
}console.log('Complete. Existing records preserved.');}finally{await payload.destroy();}

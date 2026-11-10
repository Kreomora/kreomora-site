import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.CMS_EXPORT_URL||'http://localhost:3000';
const quality=JSON.parse(await fs.readFile('data/video-quality.json','utf8'));
const result={};
for(const locale of ['ru','en']){
 const response=await fetch(`${base}/api/projects/?locale=${locale}&depth=1&limit=100&where[_status][equals]=published&where[placeholder][not_equals]=true&sort=displayOrder`);
 if(!response.ok)throw new Error(`Public CMS export failed: ${response.status}`);
 const {docs}=await response.json();
 if(docs.length!==18)throw new Error('Expected 18 published portfolio projects');
 result[locale]=docs.map(p=>{
  const q=quality.find(q=>q.slug===p.slug);if(!q)throw new Error(`Missing quality map: ${p.slug}`);
  const url=m=>{if(!m)return undefined;if(m.visibility!=='public')throw new Error('Private media cannot be exported');return '/portfolio/web/'+m.filename;};
  return {id:p.id,aspectRatio:q.webInfo.width/q.webInfo.height,title:p.displayTitle||p.title,slug:p.slug,subtitle:p.categoryLabel||p.subtitle||'',section:p.section,theme:p.theme,year:p.year,category:p.categoryLabel?[p.categoryLabel]:p.category?.map(c=>c.value)||[],services:p.categoryLabel?[p.categoryLabel]:p.services?.map(s=>s.value)||[],description:p.summary||p.description,intro:p.intro||p.summary||p.description,seoDescription:p.seoDescription||p.summary||p.description,cover:url(p.cover),coverAlt:p.displayTitle||p.title,coverVideo:url(p.heroVideo),heroVideo:url(p.heroVideo),gallery:p.gallery?.map(g=>url(g.image))||[],additionalVideos:p.additionalVideos?.map(v=>({title:v.title,src:url(v.video),poster:url(v.poster)}))||[],featured:!!p.featured,displayOrder:p.displayOrder,placeholder:false};
 });
}
for(const p of result.ru)for(const file of [p.cover,p.heroVideo,...p.gallery,...p.additionalVideos.flatMap(v=>[v.src,v.poster])].filter(Boolean))await fs.access(path.join('public',file));
await fs.writeFile('data/pages-projects.json',JSON.stringify(result,null,2)+'\n');
console.log('Exported only public published content: 18 projects × RU/EN. No users, credentials or drafts.');

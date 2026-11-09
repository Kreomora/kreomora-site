import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.TEST_URL||'http://localhost:3000';
const manifest=JSON.parse(await fs.readFile('data/portfolio-import.json','utf8'));
let pages=0,contacts=0;
for(const locale of ['ru','en']){
 const paths=['','/studio','/multstory','/about','/contact','/studio/work','/multstory/stories',...manifest.map(p=>`/${p.section}/${p.slug}`)];
 for(const path of paths){const r=await fetch(`${base}/${locale}${path}/`);assert.equal(r.status,200,locale+path);const html=await r.text();assert(html.includes(`<html lang="${locale}"`),locale+path+' lang');assert(html.includes('hrefLang="ru"')||html.includes('hreflang="ru"'));assert(html.includes('hrefLang="en"')||html.includes('hreflang="en"'));assert(r.headers.get('set-cookie')?.includes(`kreomora-locale=${locale}`));
 const links=[...html.matchAll(/href="(mailto:[^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&'));assert(links.length>0,path);for(const link of links){assert(link.startsWith('mailto:kreomora@mail.ru'));if(link.includes('subject=')){const subject=new URL(link).searchParams.get('subject');assert(subject?.startsWith('KREOMORA'));}contacts++;}
 if(path.startsWith('/studio/')&&!path.endsWith('/work'))assert(links.some(x=>decodeURIComponent(x).includes(locale==='ru'?'KREOMORA STUDIO — Коммерческий проект':'KREOMORA STUDIO — Project Inquiry')));
 if(path.startsWith('/multstory/')&&!path.endsWith('/stories'))assert(links.some(x=>decodeURIComponent(x).includes(locale==='ru'?'Персональная история':'Personal Story')));
 assert(!html.includes('VISUAL PLACEHOLDER'));assert(!/<(?:form|input|textarea)\b/i.test(html));assert(!/flexig1/i.test(html));
 for(const url of ['https://t.me/KreomoraX','https://vk.ru/club243109699']){const anchors=[...html.matchAll(/<a\b[^>]*>/g)].map(m=>m[0]).filter(a=>a.includes(`href="${url}${url.includes('t.me')?'?text=':'"'}`));assert(anchors.length>0,path+' '+url);for(const a of anchors){assert(a.includes('target="_blank"'));assert(a.includes('rel="noopener noreferrer"'));}}
 if(manifest.some(p=>path===`/${p.section}/${p.slug}`)){assert(html.includes('-1080.mp4'),path+' full quality film');assert(!html.includes('-preview.mp4'),path+' no low resolution proxy');}
 pages++;
 }
 const root=await fetch(base+'/',{redirect:'manual',headers:{Cookie:`kreomora-locale=${locale}`}});assert.equal(root.headers.get('location'),`/${locale}/`);
}
assert.equal((await fetch(base+'/',{redirect:'manual'})).headers.get('location'),'/ru/');
assert.equal((await fetch(base+'/ru/unknown-project/')).status,404);
assert.equal((await fetch(base+'/admin/')).status,200);
const ru=await (await fetch(base+'/api/projects/?where[placeholder][not_equals]=true&limit=100&locale=ru&depth=0')).json();
const en=await (await fetch(base+'/api/projects/?where[placeholder][not_equals]=true&limit=100&locale=en&depth=0')).json();assert.equal(ru.docs.length,18);assert.equal(en.docs.length,18);
for(const p of ru.docs){const q=en.docs.find(x=>x.id===p.id);assert(q);for(const field of ['displayTitle','summary','intro','seoDescription','categoryLabel']){assert(p[field],p.slug+' ru '+field);assert(q[field],p.slug+' en '+field);}for(const field of ['cover','heroVideo','coverVideo'])assert.equal(p[field],q[field]);}
console.log(`PASS: ${pages} localized pages, ${contacts} email links, RU default, cookie preferences, hreflang, 404, admin, 18 bilingual projects and shared media.`);

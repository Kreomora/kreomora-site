import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.TEST_URL||'http://localhost:3000';
const manifest=JSON.parse(await fs.readFile('data/portfolio-import.json','utf8'));
let pages=0,contacts=0;
for(const locale of ['ru','en']){
 const paths=['','/studio','/multstory','/about','/contact','/studio/work','/multstory/stories',...manifest.map(p=>`/${p.section}/${p.slug}`)];
 for(const path of paths){const r=await fetch(`${base}/${locale}${path}/`);assert.equal(r.status,200,locale+path);const html=await r.text();assert(html.includes(`<html lang="${locale}"`),locale+path+' lang');assert(html.includes('hrefLang="ru"')||html.includes('hreflang="ru"'));assert(html.includes('hrefLang="en"')||html.includes('hreflang="en"'));assert.equal(r.headers.get('set-cookie'),null);
 assert(!html.includes('mailto:'));assert(html.includes('class="email-dialog"'));assert(html.includes('kreomora@mail.ru'));contacts++;
 assert(!html.includes('VISUAL PLACEHOLDER'));assert(!/<(?:form|input|textarea)\b/i.test(html));assert(!/flexig1/i.test(html));
 for(const url of ['https://t.me/KreomoraX','https://vk.ru/club243109699']){const anchors=[...html.matchAll(/<a\b[^>]*>/g)].map(m=>m[0]).filter(a=>a.includes(`href="${url}${url.includes('t.me')?'?text=':'"'}`));assert(anchors.length>0,path+' '+url);for(const a of anchors){assert(a.includes('target="_blank"'));assert(a.includes('rel="noopener noreferrer"'));}}
 if(manifest.some(p=>path===`/${p.section}/${p.slug}`)){assert(html.includes('-1080.mp4'),path+' full quality film');assert(!html.includes('-preview.mp4'),path+' no low resolution proxy');}
 pages++;
 }

}
assert.equal((await fetch(base+'/',{redirect:'manual'})).headers.get('location'),'/ru/');
assert.equal((await fetch(base+'/ru/unknown-project/')).status,404);
for(const route of ['/admin/','/api/projects/','/ru/admin/','/en/admin/'])assert.equal((await fetch(base+route)).status,404,route+' removed');
const portfolio=JSON.parse(await fs.readFile('data/portfolio.json','utf8'));
assert.equal(portfolio.ru.length,18);assert.equal(portfolio.en.length,18);
for(const p of portfolio.ru){const q=portfolio.en.find(x=>x.id===p.id);assert(q);for(const field of ['title','description','intro','seoDescription','subtitle']){assert(p[field],p.slug+' ru '+field);assert(q[field],p.slug+' en '+field);}for(const field of ['cover','heroVideo','coverVideo'])assert.equal(p[field],q[field]);}
console.log(`PASS: ${pages} localized pages, ${contacts} email dialogs, RU default, no locale cookies, hreflang, 404, no admin/API, 18 bilingual projects and shared local media.`);

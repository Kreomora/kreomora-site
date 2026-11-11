import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {getContactMessage,getTelegramUrl,type ContactContext} from '../lib/contact';

const base=process.env.TEST_URL||'http://localhost:4174';
const projects=JSON.parse(await readFile('data/portfolio.json','utf8'));
const contexts:ContactContext[]=['general','studio','multstory','studioProject','multstoryProject'];
for(const locale of ['ru','en'] as const){
 for(const context of contexts){
  const options={locale,context,projectTitle:'Тест & Film #1 + "世界"?'};
  const message=getContactMessage(options),telegram=new URL(getTelegramUrl(options));
  assert.equal(telegram.origin+telegram.pathname,'https://t.me/KreomoraX');
  assert.equal(telegram.searchParams.get('text'),message.telegram);
  assert(message.body.includes('\n\n'));
  assert(!/[\s\u0400-\u04ff]/u.test(getTelegramUrl(options)));
  if(context.endsWith('Project'))assert(message.telegram.includes(options.projectTitle));
 }
 const cases=projects[locale] as {slug:string;section:'studio'|'multstory';title:string}[];
 const pages=[{path:'',context:'general'},{path:'/studio',context:'studio'},{path:'/multstory',context:'multstory'},{path:'/about',context:'general'},{path:'/contact',context:'general'},...cases.map(p=>({path:`/${p.section}/${p.slug}`,context:`${p.section}Project`,projectTitle:p.title}))];
 for(const page of pages){
  const html=await (await fetch(`${base}/${locale}${page.path}/`)).text();
  const links=[...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&'));
  const options={locale,...page,context:page.context as ContactContext};
  assert(links.includes(getTelegramUrl(options)),locale+page.path+' Telegram context');
  assert(!links.some(link=>link.startsWith('mailto:')),locale+page.path+' email opens a dialog');
  assert(html.includes('class="email-dialog"')&&html.includes('kreomora@mail.ru'));
  for(const link of links.filter(x=>x.startsWith('https://t.me/')))assert(new URL(link).searchParams.get('text'),page.path+' missing Telegram draft');
  assert(!links.includes('#'));
 }
}
console.log('PASS: all five contexts in RU/EN, Unicode and reserved-character encoding, copy dialogs, 46 rendered pages including all 36 localized cases, no bare Telegram or empty contact links.');

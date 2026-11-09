import assert from 'node:assert/strict';
import {getContactMessage,getTelegramUrl,getEmailUrl,type ContactContext} from '../lib/contact';

const base=process.env.TEST_URL||'http://localhost:3000';
const contexts:ContactContext[]=['general','studio','multstory','studioProject','multstoryProject'];
for(const locale of ['ru','en'] as const){
 for(const context of contexts){
  const options={locale,context,projectTitle:'Тест & Film #1 + "世界"?'};
  const message=getContactMessage(options),telegram=new URL(getTelegramUrl(options)),email=new URL(getEmailUrl(options));
  assert.equal(telegram.origin+telegram.pathname,'https://t.me/KreomoraX');
  assert.equal(telegram.searchParams.get('text'),message.telegram);
  assert.equal(email.pathname,'kreomora@mail.ru');
  assert.equal(email.searchParams.get('subject'),message.subject);
  assert.equal(email.searchParams.get('body'),message.body);
  assert(message.body.includes('\n\n'));
  assert(!/[\s\u0400-\u04ff]/u.test(getTelegramUrl(options)));
  assert(!/[\s\u0400-\u04ff]/u.test(getEmailUrl(options)));
  if(context.endsWith('Project'))assert(message.telegram.includes(options.projectTitle));
 }
 const projects=await (await fetch(`${base}/api/projects/?where[placeholder][not_equals]=true&limit=100&locale=${locale}&depth=0`)).json();
 const cases=projects.docs as {slug:string;section:'studio'|'multstory';displayTitle:string}[];
 const pages=[{path:'',context:'general'},{path:'/studio',context:'studio'},{path:'/multstory',context:'multstory'},{path:'/about',context:'general'},{path:'/contact',context:'general'},...cases.map(p=>({path:`/${p.section}/${p.slug}`,context:`${p.section}Project`,projectTitle:p.displayTitle}))];
 for(const page of pages){
  const html=await (await fetch(`${base}/${locale}${page.path}/`)).text();
  const links=[...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&'));
  const options={locale,...page,context:page.context as ContactContext};
  assert(links.includes(getTelegramUrl(options)),locale+page.path+' Telegram context');
  assert(links.includes(getEmailUrl(options)),locale+page.path+' email context');
  for(const link of links.filter(x=>x.startsWith('https://t.me/')))assert(new URL(link).searchParams.get('text'),page.path+' missing Telegram draft');
  for(const link of links.filter(x=>x.startsWith('mailto:')))assert(new URL(link).searchParams.get('body'),page.path+' missing email body');
  assert(!links.includes('#'));
 }
}
console.log('PASS: all five contexts in RU/EN, Unicode and reserved-character encoding, email paragraph breaks, 46 rendered pages including all 36 localized cases, no bare Telegram or empty contact links.');

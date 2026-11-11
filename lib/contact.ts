import type {Locale} from '@/data/translations';
import {contact} from '@/data/contact';
export const CONTACT_EMAIL=contact.email;
export type ContactType='general'|'studio'|'multstory';
export type ContactContext=ContactType|'studioProject'|'multstoryProject';
export type ContactOptions={locale:Locale;context?:ContactContext;projectTitle?:string};
export const contactMessages={
 ru:{
  general:{telegram:'Добрый день! Хотим заказать проект у KREOMORA. Подскажите, пожалуйста, как можем обсудить детали?',subject:'KREOMORA — Новый проект',body:'Добрый день!\n\nХотим заказать проект у KREOMORA.\n\nПодскажите, пожалуйста, как можем обсудить детали?\n\nСпасибо!'},
  studio:{telegram:'Добрый день! Хотим заказать коммерческий проект у KREOMORA STUDIO. Подскажите, пожалуйста, как можем обсудить идею, формат и стоимость?',subject:'KREOMORA STUDIO — Коммерческий проект',body:'Добрый день!\n\nХотим заказать коммерческий проект у KREOMORA STUDIO.\n\nХотели бы обсудить идею, формат, сроки и стоимость.\n\nПодскажите, пожалуйста, с чего лучше начать?'},
  multstory:{telegram:'Добрый день! Хотим заказать персональную историю у KREOMORA MULTSTORY. Подскажите, пожалуйста, как можем обсудить идею и детали?',subject:'KREOMORA MULTSTORY — Персональная история',body:'Добрый день!\n\nХотим заказать персональную историю у KREOMORA MULTSTORY.\n\nХотели бы обсудить идею и детали проекта.\n\nПодскажите, пожалуйста, с чего лучше начать?'},
  studioProject:(title:string)=>`Добрый день! Посмотрели проект «${title}» на сайте KREOMORA. Хотим обсудить похожий коммерческий проект. Подскажите, пожалуйста, как можем начать?`,
  multstoryProject:(title:string)=>`Добрый день! Посмотрели историю «${title}» на сайте KREOMORA. Хотим создать свою персональную историю. Подскажите, пожалуйста, как можем начать?`,
 },
 en:{
  general:{telegram:'Hello! We’d like to order a project from KREOMORA. Could we discuss the details?',subject:'KREOMORA — New Project',body:'Hello!\n\nWe’d like to order a project from KREOMORA.\n\nCould we discuss the details?\n\nThank you!'},
  studio:{telegram:'Hello! We’d like to order a commercial project from KREOMORA STUDIO. Could we discuss the idea, format and pricing?',subject:'KREOMORA STUDIO — Project Inquiry',body:'Hello!\n\nWe’d like to order a commercial project from KREOMORA STUDIO.\n\nWe’d like to discuss the concept, format, timeline and pricing.\n\nHow can we get started?'},
  multstory:{telegram:'Hello! We’d like to order a personal story from KREOMORA MULTSTORY. Could we discuss the idea and details?',subject:'KREOMORA MULTSTORY — Personal Story',body:'Hello!\n\nWe’d like to order a personal story from KREOMORA MULTSTORY.\n\nWe’d like to discuss the idea and project details.\n\nHow can we get started?'},
  studioProject:(title:string)=>`Hello! We saw the “${title}” project on the KREOMORA website and would like to discuss something similar. How can we get started?`,
  multstoryProject:(title:string)=>`Hello! We saw the “${title}” story on the KREOMORA website and would like to create our own personal film. How can we get started?`,
 },
} as const;
export function getContactMessage({locale,context='general',projectTitle}:ContactOptions){
 const messages=contactMessages[locale];
 if(context==='studioProject'||context==='multstoryProject'){
  const base=messages[context==='studioProject'?'studio':'multstory'];
  const title=projectTitle?.trim();
  return title?{...base,telegram:messages[context](title)}:base;
 }
 return messages[context];
}
export function getTelegramUrl(options:ContactOptions){return `${contact.telegram.url}?text=${encodeURIComponent(getContactMessage(options).telegram)}`;}

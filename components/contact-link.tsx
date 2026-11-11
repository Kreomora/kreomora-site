import {EmailCopy} from './email-copy';
import {getTelegramUrl,ContactType} from '@/lib/contact';
import {contact} from '@/data/contact';
import {dictionaries,Locale} from '@/data/translations';
type Channel='telegram'|'email'|'vk';
export function ContactLink({type='general',locale,channel='telegram',children,className,projectTitle}:{type?:ContactType;locale:Locale;channel?:Channel;children?:React.ReactNode;className?:string;projectTitle?:string}){
 const d=dictionaries[locale],label=children||d.contact[channel];
 const context=projectTitle&&type!=='general'?`${type}Project` as const:type;
 const options={locale,context,projectTitle};
 const name=typeof label==='string'?label:d.contact[channel];
 if(channel==='email')return <EmailCopy locale={locale} className={className||'contact-button contact-email'} label={name}>{label}</EmailCopy>;
 return <a className={className||`contact-button contact-${channel}`} href={channel==='telegram'?getTelegramUrl(options):contact.vk.url} target="_blank" rel="noopener noreferrer" aria-label={`${name} — KREOMORA — ${d.contact.newTab}`}>{label}<span aria-hidden="true">↗</span></a>;
}
export function ContactButtons({type='general',locale,includeVk=false,contextLabel=false,projectTitle}:{type?:ContactType;locale:Locale;includeVk?:boolean;contextLabel?:boolean;projectTitle?:string}){return <div className="contact-buttons"><ContactLink type={type} locale={locale} projectTitle={projectTitle}>{contextLabel?dictionaries[locale].cta[type].link:undefined}</ContactLink><ContactLink type={type} locale={locale} projectTitle={projectTitle} channel="email"/>{includeVk&&<ContactLink locale={locale} channel="vk"/>}</div>;}

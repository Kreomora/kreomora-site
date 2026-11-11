import {ContactLink} from './contact-link';
import {releaseContent} from '@/data/release-content';
import type {Locale} from '@/data/translations';

export function EditorialList({title,items,ordered=false}:{title:string;items:string[];ordered?:boolean}){
 const List=ordered?'ol':'ul';
 return <section className="wrap release-section">
  <h2>{title}</h2>
  <List className="release-steps">{items.map(item=><li key={item}>{item}</li>)}</List>
 </section>;
}

export function CustomIdea({locale,type}:{locale:Locale;type:'studio'|'multstory'}){
 const copy=releaseContent[locale][type];
 return <section className="wrap release-section idea-block">
  <h2>{copy.ideaTitle}</h2>
  <p>{copy.idea}</p>
  <p>{copy.note}</p>
  <ContactLink locale={locale} type={type}>{copy.action}</ContactLink>
 </section>;
}

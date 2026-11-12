import {releaseContent} from '@/data/release-content';
import type {Locale} from '@/data/translations';

export function EditorialList({title, items, ordered = false, embedded = false}: {
  title: string; items: string[]; ordered?: boolean; embedded?: boolean;
}){
  const List = ordered ? 'ol' : 'ul';
  const content = <List className="release-steps">{items.map(item => <li key={item}>{item}</li>)}</List>;
  return embedded ? content : <section className="wrap release-section"><h2>{title}</h2>{content}</section>;
}

export function CustomIdea({locale, type, embedded = false}: {
  locale: Locale; type: 'studio' | 'multstory'; embedded?: boolean;
}){
  const copy = releaseContent[locale][type];
  return <section className={embedded ? 'release-section idea-block idea-embedded' : 'wrap release-section idea-block'}>
    {!embedded && <h2>{copy.ideaTitle}</h2>}
    <p>{copy.idea}</p>
    <p>{copy.note}</p>
  </section>;
}

import {getPayload} from 'payload';
import config from '../payload.config';
import {projectTranslations} from '../data/project-translations';
const payload=await getPayload({config});
try{
 const {docs}=await payload.find({collection:'projects',pagination:false,depth:0,locale:'all'});
 for(const p of docs){const text=projectTranslations[p.slug];if(!text||p.placeholder)continue;
  for(const locale of ['ru','en'] as const){
   const current=await payload.findByID({collection:'projects',id:p.id,locale,fallbackLocale:false,depth:0});
   const displayTitle=text[locale==='ru'?0:1],categoryLabel=text[locale==='ru'?2:3];
   const summary=locale==='ru'?`${displayTitle} — ${categoryLabel.toLowerCase()}. ${p.section==='studio'?'Коммерческая работа KREOMORA STUDIO.':'Персональная визуальная история KREOMORA MULTSTORY.'}`:`${displayTitle} — ${categoryLabel}. ${p.section==='studio'?'A commercial film by KREOMORA STUDIO.':'A personal visual story by KREOMORA MULTSTORY.'}`;
   const desired={displayTitle,categoryLabel,summary,intro:summary,seoDescription:summary};
   const data=Object.fromEntries(Object.entries(desired).filter(([key])=>!current[key as keyof typeof current]));
   if(Object.keys(data).length)await payload.update({collection:'projects',id:p.id,locale,data});
  }
  console.log('Localized '+p.slug);
 }
}finally{await payload.destroy();}

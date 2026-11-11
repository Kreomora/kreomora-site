import {MediaVideo} from '@/components/media';
import {Reel} from '@/components/interactive';
import {CTA, Projects, SectionTitle} from '@/components/sections';
import {CustomIdea, EditorialList} from '@/components/editorial';
import {Mascot} from '@/components/mascot';
import {ContactLink} from '@/components/contact-link';
import {getProjects} from '@/lib/projects';
import {getLocale, localizedMetadata} from '@/lib/i18n';
import {dictionaries} from '@/data/translations';
import {releaseContent} from '@/data/release-content';

export async function generateMetadata(){
 const locale=await getLocale();
 return localizedMetadata(`KREOMORA STUDIO — ${dictionaries[locale].studioCopy}`,releaseContent[locale].studio.intro);
}

export default async function Studio(){
 const locale=await getLocale();
 const d=dictionaries[locale],copy=releaseContent[locale].studio;
 const projects=await getProjects('studio');
 const poster=projects[0]?.cover||'/brand/kreomora-logo-light.png';
 return <div className="dark">
  <section className="division-hero studio-hero">
   <MediaVideo poster={poster} src={projects[0]?.heroVideo} priority/>
   <div className="division-title wrap">
    <span className="eyebrow">KREOMORA / {d.studioLabel}</span>
    <h1>STUDIO</h1>
    <div className="division-bottom">
     <h2 className="lines">{d.studioHero}</h2>
     <div className="division-actions">
      <Reel poster={poster} src={projects[0]?.heroVideo}/>
      <ContactLink type="studio" locale={locale}/>
     </div>
    </div>
   </div>
   <span className="hero-scroll">{d.studioSecondary}<a href="#studio-work">{d.explore} ↓</a></span>
  </section>
  <section className="brand-teaser wrap studio-capabilities-intro">
   <div><h2>{locale==='ru'?'Коммерческое производство':'Commercial creative production'}</h2><p>{copy.intro}</p></div>
   <Mascot kind="studio" locale={locale}/>
  </section>
  <section className="wrap capabilities">
   <SectionTitle label="STUDIO" title={d.capabilities}/>
   {d.services.map(([title,description])=><div className="capability reveal" key={title}>
    <span aria-hidden="true"/><h3>{title}</h3><p>{description}</p><span aria-hidden="true">↗</span>
   </div>)}
  </section>
  <EditorialList title={copy.tasksTitle} items={copy.tasks}/>
  <EditorialList title={copy.processTitle} items={copy.steps} ordered/>
  <CustomIdea locale={locale} type="studio"/>
  <section id="studio-work" className="wrap selected">
   <SectionTitle label={d.studioLabel} title={d.studioWork} href={`/${locale}/studio/work`} link={d.index}/>
   <Projects projects={projects}/>
  </section>
  <CTA type="studio"/>
 </div>;
}

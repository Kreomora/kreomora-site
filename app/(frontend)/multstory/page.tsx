import {MediaVideo} from '@/components/media';
import {StoryExplorer} from '@/components/interactive';
import {CTA, Projects, SectionTitle} from '@/components/sections';
import {CustomIdea, EditorialList} from '@/components/editorial';
import {ContactLink} from '@/components/contact-link';
import {Mascot} from '@/components/mascot';
import {getProjects} from '@/lib/projects';
import {getLocale, localizedMetadata} from '@/lib/i18n';
import {dictionaries} from '@/data/translations';
import {releaseContent} from '@/data/release-content';

export async function generateMetadata(){
 const locale=await getLocale();
 return localizedMetadata(`KREOMORA MULTSTORY — ${dictionaries[locale].storyCopy}`,releaseContent[locale].multstory.intro);
}

export default async function Multstory(){
 const locale=await getLocale();
 const d=dictionaries[locale],copy=releaseContent[locale].multstory;
 const projects=await getProjects('multstory');
 const hero=projects.find(project=>project.slug==='family-story')||projects[0];
 return <div className="warm">
  <section className="division-hero warm-hero">
   <MediaVideo poster={hero?.cover} src={hero?.heroVideo} priority/>
   <div className="division-title wrap">
    <span className="eyebrow">KREOMORA / {d.storyLabel}</span>
    <h1>MULTSTORY</h1>
    <div className="division-bottom">
     <h2 className="lines">{d.storyHero}</h2>
     <p className="lines">{d.storySupport}</p>
    </div>
    <div className="story-hero-actions">
     <a className="text-link" href="#stories">{d.exploreStories} ↗</a>
     <ContactLink type="multstory" locale={locale}/>
    </div>
   </div>
  </section>
  <section className="memory-banner">
   <Mascot kind="multstory" locale={locale}/>
   <div>
    <span className="eyebrow">KREOMORA MULTSTORY</span>
    <h2 className="lines">{d.memoryTitle}</h2>
    <p>{copy.intro}</p>
   </div>
  </section>
  <section className="wrap services">
   <SectionTitle label="MULTSTORY" title={d.storyTypes}/>
   <StoryExplorer projects={projects}/>
  </section>
  <EditorialList title={copy.processTitle} items={copy.steps} ordered/>
  <section className="wrap services">
   <SectionTitle label="MULTSTORY" title={d.stylesTitle}/>
   <StoryExplorer styles projects={projects}/>
  </section>
  <CustomIdea locale={locale} type="multstory"/>
  <section id="stories" className="wrap selected">
   <SectionTitle label={d.storyLabel} title={d.stories} href={`/${locale}/multstory/stories`} link={d.exploreStories}/>
   <Projects projects={projects}/>
  </section>
  <CTA type="multstory"/>
 </div>;
}

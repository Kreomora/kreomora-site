import {SiteLink} from '@/components/site-link';
import {DivisionAccordion} from '@/components/division-accordion';
import {DivisionContact, DivisionHero, DivisionScene} from '@/components/division-visuals';
import {StoryExplorer} from '@/components/interactive';
import {Projects} from '@/components/sections';
import {CustomIdea, EditorialList} from '@/components/editorial';
import {getProjects} from '@/lib/projects';
import {getLocale, localizedMetadata} from '@/lib/i18n';
import {dictionaries} from '@/data/translations';
import {releaseContent} from '@/data/release-content';

export async function generateMetadata(){
  const locale = await getLocale();
  return localizedMetadata(`KREOMORA MULTSTORY — ${dictionaries[locale].storyCopy}`, releaseContent[locale].multstory.intro);
}

export default async function Multstory(){
  const locale = await getLocale();
  const d = dictionaries[locale], copy = releaseContent[locale].multstory;
  const ru = locale === 'ru';
  const projects = await getProjects('multstory');
  return <div className="warm">
    <DivisionHero locale={locale} section="multstory" intro={copy.intro} film={projects.find(project => project.slug === 'family-story')}/>
    <DivisionScene locale={locale} section="multstory">
      <DivisionAccordion contact={<DivisionContact locale={locale} section="multstory"/>} label="MULTSTORY" items={[
        {id: 'portfolio', title: ru ? 'Портфолио' : 'Portfolio', content: <>
          <Projects projects={projects}/>
          <SiteLink className="ux-button portfolio-archive" href={`/${locale}/multstory/stories/`}>
            {ru ? 'Посмотреть все работы' : 'Browse all work'}
          </SiteLink>
        </>},
        {id: 'stories', title: ru ? 'Что можно создать' : 'What we can create', content: <StoryExplorer projects={projects}/>},
        {id: 'styles', title: d.stylesTitle, content: <StoryExplorer styles projects={projects}/>},
        {id: 'process', title: copy.processTitle, content: <EditorialList title={copy.processTitle} items={copy.steps} ordered embedded/>},
        {id: 'idea', title: copy.ideaTitle, content: <CustomIdea locale={locale} type="multstory" embedded/>},
      ]}/>
    </DivisionScene>
  </div>;
}

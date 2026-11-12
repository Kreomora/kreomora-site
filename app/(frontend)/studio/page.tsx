import {SiteLink} from '@/components/site-link';
import {DivisionAccordion} from '@/components/division-accordion';
import {DivisionContact, DivisionHero, DivisionScene} from '@/components/division-visuals';
import {Projects} from '@/components/sections';
import {CustomIdea, EditorialList} from '@/components/editorial';
import {getProjects} from '@/lib/projects';
import {getLocale, localizedMetadata} from '@/lib/i18n';
import {dictionaries} from '@/data/translations';
import {releaseContent} from '@/data/release-content';

export async function generateMetadata(){
  const locale = await getLocale();
  return localizedMetadata(`KREOMORA STUDIO — ${dictionaries[locale].studioCopy}`, releaseContent[locale].studio.intro);
}

export default async function Studio(){
  const locale = await getLocale();
  const d = dictionaries[locale], copy = releaseContent[locale].studio;
  const ru = locale === 'ru';
  const projects = await getProjects('studio');
  return <div className="dark">
    <DivisionHero locale={locale} section="studio" intro={copy.intro} film={projects[0]}/>
    <DivisionScene locale={locale} section="studio">
      <DivisionAccordion contact={<DivisionContact locale={locale} section="studio"/>} label="STUDIO" items={[
        {id: 'portfolio', title: ru ? 'Портфолио' : 'Portfolio', content: <>
          <Projects projects={projects}/>
          <SiteLink className="ux-button portfolio-archive" href={`/${locale}/studio/work/`}>
            {ru ? 'Посмотреть все работы' : 'Browse all work'}
          </SiteLink>
        </>},
        {id: 'services', title: d.capabilities, content:
          <div className="division-services">
            {d.services.map(([title, description]) => <div key={title}><h3>{title}</h3><p>{description}</p></div>)}
          </div>},
        {id: 'tasks', title: copy.tasksTitle, content: <EditorialList title={copy.tasksTitle} items={copy.tasks} embedded/>},
        {id: 'process', title: copy.processTitle, content: <EditorialList title={copy.processTitle} items={copy.steps} ordered embedded/>},
        {id: 'idea', title: copy.ideaTitle, content: <CustomIdea locale={locale} type="studio" embedded/>},
      ]}/>
    </DivisionScene>
  </div>;
}

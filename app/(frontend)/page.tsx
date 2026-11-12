import {SiteLink} from '@/components/site-link';
import {MediaVideo} from '@/components/media';
import {CTA, Projects, SectionTitle} from '@/components/sections';
import {Mascot} from '@/components/mascot';
import {getProjects} from '@/lib/projects';
import {getLocale, localizedMetadata} from '@/lib/i18n';
import {dictionaries} from '@/data/translations';

export async function generateMetadata(){return localizedMetadata();}

export default async function Home(){
  const locale = await getLocale(), d = dictionaries[locale], all = await getProjects();
  const ru = locale === 'ru';
  const divisions = [
    {name: 'STUDIO', path: 'studio' as const, copy: ru ? 'Коммерческие видео и визуалы для брендов и событий.' : 'Commercial films and visuals for brands and events.'},
    {name: 'MULTSTORY', path: 'multstory' as const, copy: ru ? 'Персональные фильмы о людях, семье, событиях и воспоминаниях.' : 'Personal films about people, family, events and memories.'},
  ];

  return <>
    <section className="home-choice">
      <MediaVideo src="/media/home/family-story-hero.mp4" poster="/media/home/family-story-hero.webp" autoplay muted loop playsInline priority/>
      <div className="home-choice-shade"/>
      <div className="wrap home-choice-content">
        <h1>KREOMORA</h1>
        <p>{ru ? 'Креативная студия. Создаём коммерческие видео и персональные фильмы с помощью AI.' : 'A creative studio making commercial videos and personal films with AI.'}</p>
        <div className="home-choice-grid">
          {divisions.map(({name, path, copy}) => <div key={path}>
            <h2>KREOMORA {name}</h2>
            <p>{copy}</p>
            <SiteLink className="ux-button" href={`/${locale}/${path}/`}>{ru ? 'Перейти в' : 'Explore'} {name}</SiteLink>
          </div>)}
        </div>
      </div>
    </section>
    <section id="selected" className="wrap selected">
      <SectionTitle label={d.twoLabel} title={d.selected} href={`/${locale}/studio/#portfolio`}
        link={ru ? 'Посмотреть работы STUDIO' : 'View STUDIO work'}/>
      <Projects projects={all.filter(p => p.featured)}/>
    </section>
    <section className="home-direction-scenes" aria-label={ru ? 'Направления KREOMORA' : 'KREOMORA divisions'}>
      {divisions.map(({name, path, copy}) => <SiteLink key={path} href={`/${locale}/${path}/`} className="home-direction-scene">
        <Mascot kind={path} locale={locale}/>
        <div className="home-direction-scene-copy">
          <h2>{name}</h2>
          <p>{copy}</p>
          <span className="ux-button">{ru ? 'Перейти в' : 'Explore'} {name}</span>
        </div>
      </SiteLink>)}
    </section>
    <section className="brand-banner">
      <Mascot kind="home" locale={locale}/>
      <div><span className="eyebrow">KREOMORA</span><h2>{d.aboutShort}</h2>
        <SiteLink className="ux-button" href={`/${locale}/about/`}>{d.aboutLink}</SiteLink>
      </div>
    </section>
    <CTA/>
  </>;
}

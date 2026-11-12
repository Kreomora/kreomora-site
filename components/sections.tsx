import {SiteLink} from '@/components/site-link';
import type {Project} from '@/data/projects';
import {ProjectCard} from './interactive';
import {ProjectFilm} from './project-film';
import {MediaVideo} from './media';
import {ContactButtons, ContactLink} from './contact-link';
import {getLocale} from '@/lib/i18n';
import {dictionaries} from '@/data/translations';
import type {ContactType} from '@/lib/contact';

export function SectionTitle({label, title, href, link}: {label: string; title: string; href?: string; link?: string}){
  return <div className="section-heading">
    <div><span className="eyebrow">{label}</span><h2>{title}</h2></div>
    {href && <SiteLink className="ux-button" href={href}>{link}</SiteLink>}
  </div>;
}

export function Projects({projects}: {projects: Project[]}){
  return <div className="project-grid">{projects.map((project, index) =>
    <ProjectCard key={project.slug} project={project} index={index}/>)}</div>;
}

export async function CTA({type = 'general', project = false, projectTitle}: {
  type?: ContactType; project?: boolean; projectTitle?: string;
}){
  const locale = await getLocale(), d = dictionaries[locale];
  const heading = project ? (type === 'studio' ? d.contact.projectStudio : d.contact.projectStory) : d.cta[type].body;
  return <section className={`cta wrap cta-${type}`}>
    <span className="eyebrow">{d.cta[type].title}</span><h2 className="lines">{heading}</h2>
    <ContactButtons type={type} locale={locale} contextLabel projectTitle={projectTitle} includeVk/>
  </section>;
}

export async function CaseStudy({project: p, next}: {project: Project; next?: Project}){
  const locale = await getLocale(), d = dictionaries[locale];
  const ru = locale === 'ru';
  const back = ru ? 'Назад к портфолио' : 'Back to portfolio';
  const portfolio = `/${locale}/${p.section}/#portfolio`;
  const intro = p.intro || p.description;

  return <div className={`project-detail ${p.theme}`}>
    <section className="wrap project-opening">
      <div className="project-opening-copy">
        <SiteLink className="ux-button" href={portfolio}><span aria-hidden="true">←</span>{back}</SiteLink>
        <p className="eyebrow">{p.subtitle} · {p.year}</p>
        <h1>{p.title}</h1>
        <p>{intro}</p>
      </div>
      <ProjectFilm src={p.heroVideo} poster={p.cover} title={p.title} ratio={p.aspectRatio ?? 16 / 9} locale={locale}/>
    </section>
    {p.description !== intro && <section className="wrap project-description"><p>{p.description}</p></section>}
    {p.gallery.length > 0 && <section className="wrap case-gallery">
      <SectionTitle label={p.subtitle} title={d.frames}/>
      <div className="gallery-pair">{p.gallery.map((src, index) =>
        <div className={`gallery-frame frame-${index}`} key={src}>
          <MediaVideo poster={src} alt={`${p.title} — ${d.frame} ${index + 1}`}/>
        </div>)}</div>
    </section>}
    <section className="wrap project-end">
      {next && <SiteLink className="ux-button" href={`/${locale}/${next.section}/${next.slug}/`}>
        {d.next} · {next.title}
      </SiteLink>}
      <div>
        <SiteLink className="ux-button" href={portfolio}><span aria-hidden="true">←</span>{back}</SiteLink>
        <ContactLink type={p.section} locale={locale} projectTitle={p.title}>
          {ru ? 'Обсудить проект' : 'Discuss a project'}
        </ContactLink>
        <ContactLink locale={locale} channel="email"/>
        <ContactLink locale={locale} channel="vk"/>
      </div>
    </section>
  </div>;
}

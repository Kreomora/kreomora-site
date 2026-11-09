import {Archive} from '@/components/interactive';
import {getProjects} from '@/lib/projects';
import {getLocale,localizedMetadata} from '@/lib/i18n';
import {dictionaries} from '@/data/translations';
export async function generateMetadata(){return localizedMetadata(`MULTSTORY — ${dictionaries[await getLocale()].stories}`);}
export default async function Page(){const d=dictionaries[await getLocale()],projects=await getProjects('multstory');return <div className="warm"><section className="wrap archive"><span className="eyebrow">MULTSTORY / {d.storyLabel}</span><h1>{d.stories}<span> ({projects.length.toString().padStart(2,'0')})</span></h1><Archive projects={projects}/></section></div>;}

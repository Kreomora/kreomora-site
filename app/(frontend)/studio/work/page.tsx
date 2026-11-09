import {Archive} from '@/components/interactive';
import {getProjects} from '@/lib/projects';
import {getLocale,localizedMetadata} from '@/lib/i18n';
import {dictionaries} from '@/data/translations';
export async function generateMetadata(){return localizedMetadata(`STUDIO — ${dictionaries[await getLocale()].index}`);}
export default async function Page(){const d=dictionaries[await getLocale()],projects=await getProjects('studio');return <section className="wrap archive dark"><span className="eyebrow">STUDIO / {d.studioLabel}</span><h1>{d.index}<span> ({projects.length.toString().padStart(2,'0')})</span></h1><Archive projects={projects}/></section>;}

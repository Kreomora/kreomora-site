import {site} from '@/data/site';
import {getProjects} from '@/lib/projects';
export const dynamic='force-dynamic';
export default async function sitemap(){const projects=await getProjects();const paths=['','/studio','/studio/work','/multstory','/multstory/stories','/about','/contact',...projects.map(p=>`/${p.section}/${p.slug}`)];return ['ru','en'].flatMap(locale=>paths.map(path=>({url:`${site.url}/${locale}${path}/`,alternates:{languages:{ru:`${site.url}/ru${path}/`,en:`${site.url}/en${path}/`}},changeFrequency:'monthly' as const,priority:path===''?1:.8})));}

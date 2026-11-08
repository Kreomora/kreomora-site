import {site} from '@/data/site';
import {allProjects} from '@/data/projects';
export const dynamic='force-static';
export default function sitemap(){return ['','/studio','/studio/work','/multstory','/multstory/stories','/about','/contact',...allProjects.map(p=>`/${p.theme}/${p.slug}`)].map(path=>({url:site.url+path,changeFrequency:'monthly' as const,priority:path===''?1:0.8}));}

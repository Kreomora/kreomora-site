import {Archive} from '@/components/interactive';
import {projectsMultstory} from '@/data/projects';
export const metadata={title:'Personal Stories',alternates:{canonical:'/multstory/stories'}};
export default function Page(){return <div className="warm"><section className="wrap archive"><span className="eyebrow">MULTSTORY / STORY INDEX / 2026</span><h1>STORIES<span> (05)</span></h1><Archive projects={projectsMultstory}/></section></div>;}

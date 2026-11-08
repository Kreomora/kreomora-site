import {Archive} from '@/components/interactive';
import {projectsStudio} from '@/data/projects';
export const metadata={title:'Studio Work',alternates:{canonical:'/studio/work'}};
export default function Page(){return <section className="wrap archive dark"><span className="eyebrow">STUDIO / PROJECT INDEX / 2026</span><h1>WORK<span> (05)</span></h1><Archive projects={projectsStudio}/></section>;}

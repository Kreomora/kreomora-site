import {notFound} from 'next/navigation';
import {projectsMultstory} from '@/data/projects';
import {CaseStudy} from '@/components/sections';
export const dynamicParams=false;
export function generateStaticParams(){return projectsMultstory.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=projectsMultstory.find(p=>p.slug===slug);if(!p)return {};return {title:p.title,description:p.description,alternates:{canonical:`/multstory/${slug}`},openGraph:{title:p.title,description:p.description,images:[p.cover]}};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=projectsMultstory.find(p=>p.slug===slug);if(!p)notFound();return <CaseStudy project={p} next={projectsMultstory.find(n=>n.slug===p.nextProject)!}/>;}

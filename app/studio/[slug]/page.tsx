import {notFound} from 'next/navigation';
import {projectsStudio} from '@/data/projects';
import {CaseStudy} from '@/components/sections';
export const dynamicParams=false;
export function generateStaticParams(){return projectsStudio.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=projectsStudio.find(p=>p.slug===slug);if(!p)return {};return {title:p.title,description:p.description,alternates:{canonical:`/studio/${slug}`},openGraph:{title:p.title,description:p.description,images:[p.cover]}};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=projectsStudio.find(p=>p.slug===slug);if(!p)notFound();return <CaseStudy project={p} next={projectsStudio.find(n=>n.slug===p.nextProject)!}/>;}

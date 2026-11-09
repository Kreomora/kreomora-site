import {notFound} from 'next/navigation';
import {localizedMetadata} from '@/lib/i18n';
import {getProject} from '@/lib/projects';
import {CaseStudy} from '@/components/sections';
export const dynamic='force-dynamic';
type Args={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Args){const {project:p}=await getProject('multstory',(await params).slug);if(!p)return {};return localizedMetadata(`${p.title} — KREOMORA`,p.seoDescription||p.description,`/multstory/${p.slug}`);}
export default async function Page({params}:Args){const {project,next}=await getProject('multstory',(await params).slug);if(!project)notFound();return <CaseStudy project={project} next={next}/>;}

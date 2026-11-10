import 'server-only';
import {cache} from 'react';
import portfolio from '@/data/portfolio.json';
import {getLocale} from '@/lib/i18n';
import type {Project,Section} from '@/data/projects';

// Public, published content only. No CMS, database or credentials at build/runtime.
export const getProjects=cache(async(section?:Section):Promise<Project[]>=>{
 const projects=portfolio[await getLocale()] as Project[];
 return section?projects.filter(project=>project.section===section):projects;
});
export const getProject=cache(async(section:Section,slug:string)=>{
 const projects=await getProjects(section);
 const index=projects.findIndex(project=>project.slug===slug);
 return {project:projects[index],next:projects.length>1?projects[(index+1)%projects.length]:undefined};
});

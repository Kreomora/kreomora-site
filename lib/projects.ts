import 'server-only';
import videoQuality from '@/data/video-quality.json';
import {cache} from 'react';
import {getPayload} from 'payload';
import config from '@payload-config';
import {getLocale} from '@/lib/i18n';
import type {Project,Section} from '@/data/projects';
import type {Media,Project as CMSProject} from '@/payload-types';
function media(value:number|Media|null|undefined){return value&&typeof value==='object'?value:undefined;}
const url=(value:number|Media|null|undefined)=>media(value)?.url||undefined;
function mapProject(p:CMSProject):Project{return {id:p.id,aspectRatio:(()=>{const q=videoQuality.find(v=>v.slug===p.slug);return q?q.webInfo.width/q.webInfo.height:16/9;})(),title:p.displayTitle||p.title,slug:p.slug,subtitle:p.categoryLabel||p.subtitle||'',section:p.section,theme:p.theme,year:p.year,category:p.categoryLabel?[p.categoryLabel]:p.category?.map(c=>c.value)||[],services:p.categoryLabel?[p.categoryLabel]:p.services?.map(s=>s.value)||[],description:p.summary||p.description,intro:p.intro||p.summary||p.description,seoDescription:p.seoDescription||p.summary||p.description,cover:url(p.cover)||`/media/home/${p.section}.svg`,coverAlt:p.displayTitle||p.title,coverVideo:url(p.coverVideo),heroVideo:url(p.heroVideo),gallery:p.gallery?.flatMap(g=>url(g.image)?[url(g.image)!]:[])||[],additionalVideos:p.additionalVideos?.flatMap(v=>url(v.video)?[{title:v.title,src:url(v.video)!,poster:url(v.poster)||url(p.cover)||`/media/home/${p.section}.svg`}]:[])||[],featured:!!p.featured,displayOrder:p.displayOrder,placeholder:!!p.placeholder};}
export const getProjects=cache(async(section?:Section):Promise<Project[]>=>{const payload=await getPayload({config});const result=await payload.find({collection:'projects',locale:await getLocale(),fallbackLocale:'ru',overrideAccess:false,draft:false,pagination:false,depth:1,sort:['displayOrder','id'],where:{and:[{_status:{equals:'published'}},{placeholder:{not_equals:true}},...(section?[{section:{equals:section}}]:[])]}});return result.docs.map(mapProject);});
export const getProject=cache(async(section:Section,slug:string)=>{const projects=await getProjects(section);const index=projects.findIndex(p=>p.slug===slug);return {project:projects[index],next:projects.length>1?projects[(index+1)%projects.length]:undefined};});

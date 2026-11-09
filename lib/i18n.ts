import 'server-only';
import {headers} from 'next/headers';
import {cache} from 'react';
import type {Metadata} from 'next';
import {dictionaries,Locale} from '@/data/translations';
import {site} from '@/data/site';
export const getLocale=cache(async():Promise<Locale>=>(await headers()).get('x-kreomora-locale')==='en'?'en':'ru');
export const getDictionary=cache(async()=>dictionaries[await getLocale()]);
export async function localizedMetadata(title?:string,description?:string,path?:string):Promise<Metadata>{
 const locale=await getLocale(),d=dictionaries[locale];const route=path??(await headers()).get('x-kreomora-path')??'/';
 const suffix=route==='/'?'':route.replace(/\/$/,'');
 return {metadataBase:new URL(site.url),title:title||d.seoTitle,description:description||d.seoDescription,alternates:{canonical:`/${locale}${suffix}/`,languages:{ru:`/ru${suffix}/`,en:`/en${suffix}/`}},openGraph:{title:title||d.seoTitle,description:description||d.seoDescription,locale:locale==='ru'?'ru_RU':'en_US',alternateLocale:[locale==='ru'?'en_US':'ru_RU'],images:['/brand/mascot/mascot-home-hero.webp']}};
}

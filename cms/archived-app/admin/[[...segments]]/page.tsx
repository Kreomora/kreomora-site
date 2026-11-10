import config from '@payload-config';
import {RootPage,generatePageMetadata} from '@payloadcms/next/views';
import {notFound} from 'next/navigation';
import {importMap} from '../importMap';
type Args={params:Promise<{segments:string[]}>;searchParams:Promise<{[key:string]:string|string[]}>};
export const generateMetadata=({params,searchParams}:Args)=>generatePageMetadata({config,params,searchParams});
export default async function Page(args:Args){if((await args.params).segments?.[0]==='create-first-user')notFound();return RootPage({config,...args,importMap});}

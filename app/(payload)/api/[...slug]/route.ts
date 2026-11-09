import config from '@payload-config';
import {REST_GET,REST_POST,REST_DELETE,REST_PATCH,REST_PUT,REST_OPTIONS} from '@payloadcms/next/routes';
export const GET=REST_GET(config);
const post=REST_POST(config);
export const POST:ReturnType<typeof REST_POST>=async(request,args)=>{
 const {slug=[]}=await args.params;
 if(slug[0]==='users'&&slug[1]==='first-register')return Response.json({error:'Use the local cms:admin command.'},{status:403});
 return post(request,args);
};
export const DELETE=REST_DELETE(config);
export const PATCH=REST_PATCH(config);
export const PUT=REST_PUT(config);
export const OPTIONS=REST_OPTIONS(config);

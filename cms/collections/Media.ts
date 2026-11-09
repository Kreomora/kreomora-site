import path from 'node:path';
import type {CollectionConfig} from 'payload';
import {authenticated} from '../access';
export const Media:CollectionConfig={
 slug:'media',admin:{useAsTitle:'filename',description:'Private uploads require login. Mark portfolio assets public before publishing.'},
 access:{create:authenticated,read:({req})=>req.user?true:{visibility:{equals:'public'}},update:authenticated,delete:authenticated},
 upload:{staticDir:path.resolve(/*turbopackIgnore: true*/ process.env.MEDIA_DIR||'storage/media'),mimeTypes:['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/webm'],filesRequiredOnCreate:true},
 fields:[{name:'alt',type:'text',required:true},{name:'visibility',type:'select',required:true,defaultValue:'private',options:['private','public']}],
 hooks:{beforeDelete:[async({id,req})=>{const used=await req.payload.find({collection:'projects',req,overrideAccess:true,limit:1,where:{or:[{cover:{equals:id}},{coverVideo:{equals:id}},{heroVideo:{equals:id}},{'gallery.image':{equals:id}},{'additionalVideos.video':{equals:id}},{'additionalVideos.poster':{equals:id}}]}});if(used.totalDocs)throw new Error('Media is used by a project. Remove the reference first.');}]},
};

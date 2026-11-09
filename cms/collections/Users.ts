import type {CollectionConfig} from 'payload';
import {authenticated} from '../access';
export const Users:CollectionConfig={slug:'users',admin:{useAsTitle:'email'},auth:{maxLoginAttempts:5,lockTime:600000,tokenExpiration:7200,cookies:{sameSite:'Lax',secure:process.env.NODE_ENV==='production'}},access:{admin:({req})=>Boolean(req.user),create:authenticated,read:authenticated,update:authenticated,delete:authenticated},fields:[{name:'name',type:'text',required:true}]};

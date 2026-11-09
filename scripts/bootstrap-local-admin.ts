import {randomBytes} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
import {getPayload} from 'payload';
import config from '../payload.config';
const payload=await getPayload({config});
try{
 const users=await payload.find({collection:'users',limit:1});
 if(users.totalDocs){console.log('An admin already exists; no changes made.');}
 else {const password=randomBytes(24).toString('base64url');const email='admin@kreomora.local';await payload.create({collection:'users',data:{email,name:'KREOMORA Admin',password}});mkdirSync('storage',{recursive:true});writeFileSync('storage/admin-credentials.txt',`Local CMS: http://localhost:3000/admin\nEmail: ${email}\nPassword: ${password}\n\nChange this password in your account after signing in. This file is ignored by Git.\n`,{mode:0o600});console.log('Local admin created. Credentials saved privately to storage/admin-credentials.txt.');}
}finally{await payload.destroy();}

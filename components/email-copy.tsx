'use client';

import {useId, useRef, useState} from 'react';
import {contact} from '@/data/contact';
import type {Locale} from '@/data/translations';

export function EmailCopy({locale, className, children, label}: {
 locale: Locale;
 className: string;
 children: React.ReactNode;
 label: string;
}){
 const dialog=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLButtonElement>(null);
 const title=useId();
 const [status,setStatus]=useState<'idle'|'copied'|'manual'>('idle');
 const ru=locale==='ru';

 async function copy(){
  try{
   await navigator.clipboard.writeText(contact.email);
   setStatus('copied');
  }catch{
   setStatus('manual');
  }
 }

 return <>
  <button ref={trigger} type="button" className={className} aria-label={label} aria-haspopup="dialog" onClick={()=>{
   setStatus('idle');
   dialog.current?.showModal();
  }}>{children}<span aria-hidden="true">↗</span></button>
  <dialog ref={dialog} className="email-dialog" aria-labelledby={title}
   onClick={event=>{if(event.target===event.currentTarget)dialog.current?.close();}}
   onClose={()=>trigger.current?.focus()}>
   <div className="email-dialog-content">
    <button type="button" className="email-close" aria-label={ru?'Закрыть':'Close'} onClick={()=>dialog.current?.close()}>×</button>
    <h2 id={title}>{ru?'Наша почта':'Our email'}</h2>
    <p className="email-address">{contact.email}</p>
    <button type="button" className="contact-button" autoFocus onClick={copy}>
     {status==='copied'?(ru?'✓ Скопировано':'✓ Copied'):(ru?'Скопировать':'Copy')}
    </button>
    <p role="status" className="email-status">{status==='manual'?(ru?'Выделите и скопируйте адрес вручную.':'Select the address to copy it manually.'):status==='copied'?(ru?'Адрес скопирован.':'Email address copied.'):''}</p>
   </div>
  </dialog>
 </>;
}

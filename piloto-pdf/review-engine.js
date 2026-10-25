(function(root){
 'use strict';
 const APP='discipulo-genesis-review',VERSION=1;
 function items(corpus){return Object.entries(corpus.versions).flatMap(([version,chapters])=>Object.entries(chapters).flatMap(([chapter,verses])=>verses.filter(v=>v.warnings.length).map(v=>({id:`${version}:${chapter}:${v.verse}`,version,chapter:Number(chapter),verse:v.verse,original:v.text,pages:[...v.pages],warnings:v.warnings}))));}
 function empty(hash){return {app:APP,formatVersion:VERSION,sourceSha256:hash,entries:{}};}
 function validate(value,hash,queue){
  if(!value||value.app!==APP||value.formatVersion!==VERSION||value.sourceSha256!==hash||!value.entries||typeof value.entries!=='object'||Array.isArray(value.entries))throw Error('Arquivo de revisão incompatível com este PDF.');
  const known=new Map(queue.map(item=>[item.id,item]));const clean=empty(hash);
  for(const [id,entry] of Object.entries(value.entries)){
   const item=known.get(id);
   if(!item||!entry||entry.original!==item.original||!['pending','checked','corrected'].includes(entry.status)||typeof entry.text!=='string'||(entry.status!=='pending'&&!entry.text.trim())||entry.text.length>20000||typeof entry.note!=='string'||entry.note.length>10000||typeof entry.updatedAt!=='string'||!Number.isFinite(Date.parse(entry.updatedAt)))throw Error('Revisão inválida ou texto de origem diferente: '+id);
   if(entry.status==='checked'&&entry.text!==item.original)throw Error('Texto alterado marcado como original: '+id);
   if(entry.status==='corrected'&&entry.text===item.original)throw Error('Correção sem alteração: '+id);
   clean.entries[id]={original:item.original,text:entry.text,note:entry.note,status:entry.status,updatedAt:entry.updatedAt};
  }
  return clean;
 }
 function save(state,item,text,note,confirmed,now=new Date().toISOString()){
  if(confirmed&&!text.trim())throw Error('O texto do versículo não pode ficar vazio.');
  if(text.length>20000||note.length>10000)throw Error('Texto ou anotação excede o limite.');
  const next=JSON.parse(JSON.stringify(state));
  next.entries[item.id]={original:item.original,text,note,status:confirmed?(text===item.original?'checked':'corrected'):'pending',updatedAt:now};return next;
 }
 function merge(local,incoming){
  const next=JSON.parse(JSON.stringify(local));const conflicts=[];
  for(const [id,entry] of Object.entries(incoming.entries)){
   const previous=next.entries[id];
   if(!previous)next.entries[id]=entry;
   else if(previous.text!==entry.text||previous.note!==entry.note||previous.status!==entry.status)conflicts.push(id);
  }
  return {state:next,conflicts};
 }
 const api={items,empty,validate,save,merge};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GenesisReview=api;
})(globalThis);

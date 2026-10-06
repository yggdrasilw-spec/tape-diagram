const {spawnSync}=require('node:child_process');
const path=require('node:path');
for(const file of ['qa-tape-diagram.cjs','qa-tape-extension.cjs','qa-tape-workshop.cjs']){
  const result=spawnSync(process.execPath,[path.join(__dirname,file)],{stdio:'inherit'});
  if(result.status!==0)process.exit(result.status||1);
}

import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,readdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

// Exercise the production shell block against real file trees, without network,
// deployment credentials, or replacements for the staging commands themselves.
const source=await readFile(new URL('../cdpt.sh',import.meta.url),'utf8');
const begin=source.indexOf('  if [[ -s "$ARTIFACT_DIR/artifact.tar" ]]; then');
const finish=source.indexOf('  ok "reusing the exact build',begin);
assert(begin>=0&&finish>begin,'Cannot locate the production artifact staging block');
const block=source.slice(begin,finish);
const fixedBackup='  if [[ -e dist ]]; then\n    PREVIOUS_DIST_DIR="$(mktemp -d "$LOG_DIR/cdpt-previous.XXXXXX")"\n    mv dist "$PREVIOUS_DIST_DIR/site"\n  fi';
assert(block.includes(fixedBackup),'Artifact backup must remain outside the deployment tree');
const originalFault=block.replace(fixedBackup,'  [[ ! -e dist ]] || mv dist "$ARTIFACT_DIR/previous-dist"');
async function files(base,path=''){
 const result=[];for(const entry of await readdir(join(base,path),{withFileTypes:true})){
  const relative=path?path+'/'+entry.name:entry.name;
  if(entry.isDirectory())result.push(...await files(base,relative));
  else result.push([relative,await readFile(join(base,relative),'utf8')]);
 }return result.sort((a,b)=>a[0].localeCompare(b[0]));
}
async function stage(script,{tar=false,previous=true}={}){
 const root=await mkdtemp(join(tmpdir(),'sciti-artifact-test-'));
 try{
  const logs=join(root,'.tmp'),artifact=join(logs,'artifact'),payload=tar?join(root,'payload'):artifact;
  await mkdir(join(payload,'static'),{recursive:true});
  await mkdir(artifact,{recursive:true});
  await writeFile(join(payload,'index.html'),'validated HTML');
  await writeFile(join(payload,'static/app.js'),'validated JS');
  const expected=await files(payload);
  if(tar){const packed=spawnSync('tar',['-cf',join(artifact,'artifact.tar'),'-C',payload,'.']);assert.equal(packed.status,0,packed.stderr.toString());}
  if(previous){await mkdir(join(root,'dist'));await writeFile(join(root,'dist/index.html'),'old HTML');await writeFile(join(root,'dist/old-only.js'),'old JS');}
  const run=spawnSync('bash',['-c','set -euo pipefail\n'+script],{cwd:root,env:{...process.env,LOG_DIR:logs,ARTIFACT_DIR:artifact},encoding:'utf8'});
  assert.equal(run.status,0,run.stderr);
  const deployed=await files(join(root,'dist'));
  const archives=(await readdir(logs)).filter(name=>name.startsWith('cdpt-previous.'));
  if(script===block&&previous){assert.equal(archives.length,1,'The previous build must be preserved outside dist');assert.equal(await readFile(join(logs,archives[0],'site/old-only.js'),'utf8'),'old JS');}
  return {deployed,expected};
 }finally{await rm(root,{recursive:true,force:true});}
}
for(const options of [{},{tar:true},{previous:false}]){const result=await stage(block,options);assert.deepEqual(result.deployed,result.expected,'The deployment tree must equal the validated artifact');}
const fault=await stage(originalFault);assert.notDeepEqual(fault.deployed,fault.expected,'The original nested-backup failure must be detected');
assert(fault.deployed.some(([path])=>path==='previous-dist/old-only.js'));
console.log('Validated artifact staging: flat, tar and first deployment pass; original nested-backup fault rejected.');

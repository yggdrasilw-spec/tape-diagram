const {chromium,launchOptions,rootPath,outputDir}=require('./qa-runtime.cjs');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const G=require('../app/groups.js');
const data={kind:'groups',a:3,b:4,unknown:'total',names:{a:'一皿分',b:'お皿の数',total:'ぜんぶ'},units:{a:'こ',b:'皿',total:'こ'},story:['あめのお話']};
assert.equal(G.validate(data).total,12);assert.throws(()=>G.validate({...data,a:0}));assert.throws(()=>G.validate({...data,b:13}));assert.throws(()=>G.validate({...data,b:2.5}));assert.equal(G.startRole(data),'a');assert.equal(G.startRole({...data,unknown:'a'}),'total');
(async()=>{const browser=await chromium.launch(launchOptions);try{
 const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(require('node:url').pathToFileURL(path.join(rootPath,'app/groups.html')).href);
 for(const unknown of ['total','a','b']){
  await page.locator('#groupsUnknown').selectOption(unknown);
  await page.getByRole('button',{name:unknown==='total'?'一皿分から':'ぜんぶから',exact:true}).click();assert.equal(await page.locator('.groupTape').count(),1);
  await page.getByRole('button',{name:'まとまりを 図にする',exact:true}).click();assert.equal(await page.locator('.groupTape').count(),unknown==='b'?2:4);
  await page.locator('#check').click();assert((await page.locator('#status').textContent()).includes('もう一度'));
  for(const r of ['a','b','total']){await page.locator('[data-fact="'+r+'"]').click();await page.locator('[data-range="'+r+'"]').press('Enter');}
  assert((await page.locator('#figure').textContent()).includes('□'));await page.locator('#check').click();assert((await page.locator('#status').textContent()).includes('つながった'));
 }
 fs.mkdirSync(outputDir,{recursive:true});await page.screenshot({path:path.join(outputDir,'groups-unknown-count.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(outputDir,'groups-mobile.png'),fullPage:true});
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,multiply:true,equalSharing:true,grouping:true,unknownCountHidden:true,keyboard:true,mobile:true}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

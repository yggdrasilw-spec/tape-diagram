const {chromium}=require('playwright');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const rootPath=path.resolve(__dirname,'..');
module.exports={chromium,rootPath,appUrl:pathToFileURL(path.join(rootPath,'app/index.html')).href,outputDir:process.env.QA_OUTPUT_DIR||path.join(rootPath,'artifacts/qa'),launchOptions:{headless:true,...(process.env.QA_CHROME?{executablePath:process.env.QA_CHROME}:{})}};

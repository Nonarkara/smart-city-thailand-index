// Reproducible municipal context, outside SCITI's scored/registry city API.
import esbuild from "esbuild";
import {mkdirSync,readFileSync,writeFileSync,unlinkSync} from "node:fs";
import {dirname,join} from "node:path";
import {tmpdir} from "node:os";
import {fileURLToPath,pathToFileURL} from "node:url";
const root=join(fileURLToPath(import.meta.url),"..","..");
const result=await esbuild.build({entryPoints:[join(root,"src/laemChabangData.ts")],bundle:true,platform:"node",format:"esm",write:false,logLevel:"error"});
const temporary=join(tmpdir(),`sciti-municipal-context-${process.pid}.mjs`);writeFileSync(temporary,result.outputFiles[0].text);
const {laemChabangProfile:profile,validateMunicipalProfile}=await import(pathToFileURL(temporary).href);unlinkSync(temporary);
if(!validateMunicipalProfile(profile))throw Error("Municipal context contract invalid");
const encoded=JSON.stringify(profile,null,2)+"\n";
for(const base of ["public","dist"]){const target=join(root,base,"data/cities/laem-chabang.json");mkdirSync(dirname(target),{recursive:true});writeFileSync(target,encoded);}
// A shared city URL must expose truthful static metadata to link crawlers too.
const index=join(root,"dist/index.html");
try{let html=readFileSync(index,"utf8");const escape=s=>s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));const title=profile.title.en+" | SCITI city data",description=profile.introduction.en+" "+profile.certification.note.en;
 html=html.replace(/<meta[^>]*name="description"[^>]*>/g, `<meta name="description" content="${escape(description)}">`);
 html=html.replace(/<title>[\s\S]*?<\/title>/,"<title>"+escape(title)+"</title>");
 const meta=`<link rel="canonical" href="${profile.links.profile}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${profile.links.profile}">`;
 html=html.replace(/<link[^>]*rel="canonical"[^>]*>/g,"").replace(/<meta[^>]*property="og:(?:title|description|url)"[^>]*>/g,"").replace("</head>",meta+"</head>");const target=join(root,"dist/city/laem-chabang/index.html");mkdirSync(dirname(target),{recursive:true});writeFileSync(target,html);
 const sitemapPath=join(root,"dist/sitemap.xml");let sitemap=readFileSync(sitemapPath,"utf8");if(!sitemap.includes(profile.links.profile)){sitemap=sitemap.replace("</urlset>",`  <url><loc>${profile.links.profile}</loc></url>\n</urlset>`);writeFileSync(sitemapPath,sitemap);}
}catch(error){if(error.code!=="ENOENT")throw error;}
console.log("Municipal context: /city/laem-chabang/ and /data/cities/laem-chabang.json; assessment=null");

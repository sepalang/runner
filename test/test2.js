const runner = require("../dist");

runner(async ({ run, find })=>{
  
  console.log("from executed file (default)")
  const path1 = find("");
  const path2 = find(".");
  const path3 = find("./");
  const path4 = find("./file.js");
  const path5 = find("../");
  console.log({path1, path2, path3, path4, path5});

  
  console.log("from __dirname (directory)")
  const rpath1 = find("",__dirname);
  const rpath2 = find(".",__dirname);
  const rpath3 = find("./",__dirname);
  const rpath4 = find("./file.js",__dirname);
  const rpath5 = find("../",__dirname);
  console.log({rpath1, rpath2, rpath3, rpath4, rpath5});

})
.catch((e)=>{
  // catch block;
  process.exit(1);
})
.then(()=>{
  // finally block
  process.exit(0);
});
const runner = require("../dist");

runner(async ({ run, cd, cwcd })=>{
  
  console.log("from executed file (default)");
  const path0 = cd();
  const path1 = cd("");
  const path2 = cd(".");
  const path3 = cd("./");
  const path4 = cd("./file.js");
  const path5 = cd("../");
  console.log({path0, path1, path2, path3, path4, path5});

  
  console.log("from __dirname (directory)");
  const rpath1 = cd("",__dirname);
  const rpath2 = cd(".",__dirname);
  const rpath3 = cd("./",__dirname);
  const rpath4 = cd("./file.js",__dirname);
  const rpath5 = cd("../",__dirname);
  console.log({rpath1, rpath2, rpath3, rpath4, rpath5});
  
  
  const path6 = cwcd();
  const path7 = cwcd('./test');
  const path8 = cwcd('./test/test.js');
  const path9 = cwcd('../');
  console.log({ path6, path7, path8, path9 });

})
.catch((e)=>{
  // catch block;
  process.exit(1);
})
.then(()=>{
  // finally block
  process.exit(0);
});
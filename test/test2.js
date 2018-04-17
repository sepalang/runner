const runner = require('../dist');

runner(async ({ exec, find })=>{
  const path1 = find("");
  const path2 = find(".");
  const path3 = find("./");
  const path4 = find("./file.js");
  const path5 = find("../");
  
  console.log({path1, path2, path3, path4, path5});
})
.catch((e)=>{
  // catch block;
  process.exit(1);
})
.then(()=>{
  // finally block
  process.exit(0);
});
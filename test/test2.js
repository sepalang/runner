const runner = require('../dist');

runner(async ({ exec, find })=>{
  const path1 = find("./");
  const path2 = find("../");
  const path3 = find("../../");
  
  console.log({path1, path2, path3});
})
.catch((e)=>{
  // catch block;
  process.exit(1);
})
.then(()=>{
  // finally block
  process.exit(0);
});
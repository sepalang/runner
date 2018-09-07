[![CircleCI](https://circleci.com/gh/sepalang/runner/tree/master.svg?style=shield)](https://circleci.com/gh/sepalang/runner/tree/master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/36b7164939d746e99394686e9dbdc9b5)](https://www.codacy.com/app/labeldock/runner?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=sepalang/runner&amp;utm_campaign=Badge_Grade)

# 🏃 runner
It was created to make child processes easier.

### usage
Run the command from your npm project.
```
npm install @sepalang/runner
```

Then write an async await function to execute sequentially.
```js
const runner = require("runner"); //or import runner form "runner";

runner(async ({ run, find, timeout })=>{
  // Sequential execution using await
  
  await run("pwd");
  /*
    /Users/user/runner/test
  */
  
  
  // Can run vim.
  await run("vim");
  
  
  // Can run npm.
  await run("npm run-script");
  
  
  let stdout;
  ({ stdout } = await run("pwd",{ capture:true }));
  console.log(stdout); // ['/Users/user/runner/test']
  
  
  ({ stdout } = await run("ls -a",{ capture:true }));
  console.log(stdout); // [ '.\n..\ntest-vim.js\ntest1.js\ntest2.js\ntest3.js' ]
  
  
  // There is always a way to find the path when executing the process. Easy is always good.
  
  const path1 = find("");
  const path2 = find(".");
  const path3 = find("./");
  const path4 = find("./file.js");
  const path5 = find("../");
  
  console.log({path1, path2, path3, path4});
  /*
    { 
      path1: '/Users/user/runner/test/test.js',
      path2: '/Users/user/runner/test/test.js',
      path3: '/Users/user/runner/test',
      path4: '/Users/user/runner/test/file.js',
      path5: '/Users/user/runner'
    }
  */
  
  //wait 3000ms
  await timeout(3000);
  
  await timeout(()=>{
    //wait 3000ms
  },3000);
})
.catch((e)=>{
  // catch block;
  process.exit(1);
})
.then(()=>{
  // finally block
  process.exit(0);
});

```

### use bin
```
runner ./other/pacakge npm start
```
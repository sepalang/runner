[![CircleCI](https://circleci.com/gh/sepalang/runner/tree/master.svg?style=shield)](https://circleci.com/gh/sepalang/runner/tree/master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/36b7164939d746e99394686e9dbdc9b5)](https://www.codacy.com/app/labeldock/runner?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=sepalang/runner&amp;utm_campaign=Badge_Grade)
[![Greenkeeper badge](https://badges.greenkeeper.io/sepalang/runner.svg)](https://greenkeeper.io/)

# 🏃 runner
It was created to make child processes easier.

### usage
Run the command from your npm project.
```
npm install @sepalang/runner
```

Then write an async await function to execute sequentially.
```js
const runner = require("@sepalang/runner"); //or import runner form "runner";

runner(async ({ run, cd, cwdcd, timeout, prompt, echo })=>{
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
  
  
  // There is always a way to find the path when executing the file. Easy is always good.
  
  const path1 = cd("");
  const path2 = cd(".");
  const path3 = cd("./");
  const path4 = cd("./file.js");
  const path5 = cd("../");
  
  console.log({path1, path2, path3, path4, path5});
  /*
    { 
      path1: '/Users/user/runner/test/test.js',
      path2: '/Users/user/runner/test/test.js',
      path3: '/Users/user/runner/test',
      path4: '/Users/user/runner/test/file.js',
      path5: '/Users/user/runner'
    }
  */
  
  const path6 = cwdcd();
  const path7 = cwdcd('test');
  const path8 = cwdcd('test/test.js');
  const path9 = cwdcd('../');
  
  console.log({ path6, path7, path8, path9 });
  
  /*
    { 
      path6: '/Users/user/runner/',
      path7: '/Users/user/runner/test',
      path8: '/Users/user/runner/test/test.js',
      path9: '/Users/user/'
    }
  */
  
  //wait 3000ms
  await timeout(3000);  
  await timeout(()=>{
    //wait 3000ms
  },3000);
  
  //prompt
  const a = await prompt("Please enter any key")
  echo(`You entered is '${a}'.`)
  
  const b = await prompt({
    message: "Please enter y or n.",
    validate: (input)=>["y","n"].includes(input) ? true : "Be sure to enter y or n."
  })
  echo(`You entered is ${b}`)
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

### cmd
```
runner ./other/cwd/path npm start
```

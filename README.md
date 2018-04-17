# 🏃 runner
It was created to make child processes easier.

### usage
Run the command from your npm project.
```
npm install sepalang/runner
```

Then write an async await function to execute sequentially.
```js
const runner = require('runner'); //or import runner form 'runner';

runner(async ({ exec, find })=>{
  // Sequential execution using await
  
  const { stdout:pout } = await exec("pwd");
  const { stdout:lout } = await exec("ls -a");
  
  console.log("PWD -\n",pout);
  console.log("LS  -\n",lout);
  /*
    PWD -
    /Users/user/runner/test

    LS  -
     .
    ..
    test.js
  */
  
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
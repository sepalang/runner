# 🏃 runner
It was created to make other processes easier.

### usage
Run the command from your npm project.
```
npm install sepalang/runner
```

Then write an async await function to execute sequentially.
```js
const runner = require('runner'); //or import runner form 'runner';

runner(async ({ exec, find })=>{
  const { stdout:pwdout } = await exec("pwd");
  const { stdout:lsout } = await exec("ls -a");
  
  console.log("PWD -\n",pwdout);
  console.log("LS  -\n",lsout);
  /*
    PWD -
    /Users/user/runner/test

    LS  -
     .
    ..
    test.js
  */
  
  const path1 = find("./");
  const path2 = find("../");
  const path3 = find("../../");
  
  console.log({path1, path2, path3});
  /*
    { 
      path1: '/Users/user/runner/test/test.js',
      path2: '/Users/user/runner/test',
      path3: '/Users/user/runner'
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
});

```


```
# runner


### usage
Run the command from your npm project.
```
npm install sepalang/runner
```

Then write an async await function to execute sequentially.
```js
const runner = require('runner'); //or import runner form 'runner';

runner(async ({ exec })=>{
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
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
  await exec("pwd");
  await exec("ls");
})
.catch((e)=>{
  // catch block;
  console.log("reason\n",e)
  process.exit(1);
})
.then(()=>{
  // finally block
  process.exit(0);
});

```
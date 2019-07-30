describe('run', () => {
  
  
  const runner = require("../dist");
  let stdout;
  let code;
  
  it('Has pwd then pass', async ()=>{
    await runner(async ({ run })=>{
      const { code } = await run("pwd");
      expect(code).toEqual(0);
    })
  });
  
  it('Run root and /test/spec.js then pass',async ()=>{
    await runner(async ({ run, join })=>{
      const { stdout:[pwd1] } = await run("pwd", { capture:true });
      expect(pwd1).toEqual(join(__dirname, ".."));
      expect(join(pwd1,"test")).toEqual(__dirname);
    })
  });
  
  it('Can run bin file in node_modules then pass',async ()=>{
    await runner(async ({ run, join })=>{
      const { code, stdout:[out] } = await run("npm-path", { capture:true });
      expect(code).toEqual(0);
      expect(!!out.length).toEqual(true);
    });
  });
  
  it('TODO : test dircd',async ()=>runner(async ({ dircd, packagePath, join })=>{
    const path0 = dircd();
    const path1 = dircd("");
    const path2 = dircd(".");
    const path3 = dircd("./");
    const path4 = dircd("./file.js");
    const path5 = dircd("../");
    //path1: '/Users/user/runner/test/test.js',
    //path2: '/Users/user/runner/test/test.js',
    //path3: '/Users/user/runner/test',
    //path4: '/Users/user/runner/test/file.js',
    //path5: '/Users/user/runner'
    expect(true).toEqual(true);
  }));
  
  it('TODO : test cd',async ()=>runner(async ({ cd })=>{
    const path1 = cd("",__dirname);
    const path2 = cd(".",__dirname);
    const path3 = cd("./",__dirname);
    const path4 = cd("./file.js",__dirname);
    const path5 = cd("../",__dirname);
    expect(true).toEqual(true);
  }));
  
  it('TODO : test cwdcd',async ()=>runner(async ({ cwdcd })=>{
    const cwd = process.cwd();
    const path6 = cwdcd();
    const path7 = cwdcd('./test');
    const path8 = cwdcd('./test/test.js');
    const path9 = cwdcd('../');
    expect(true).toEqual(true);
  }));
  
  it('test timeout',async ()=>runner(async ({ timeout })=>{
    const plus3sec = Date.now() + 3000;
    const plus2sec = Date.now() + 2000;
    
    await timeout(2100);
    
    expect(Date.now()>plus2sec).toEqual(true);
    
    const plus1sec = Date.now() + 1000;
    
    await timeout(1100);
    
    expect(Date.now()>plus1sec).toEqual(true);
    expect(Date.now()>plus3sec).toEqual(true);
  }));
  
});
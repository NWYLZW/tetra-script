/**
 * @desc   test-Parser.js
 * @author yijie
 * @date   2021-01-30
 * @note   yijie 2021-01-30 Created the file test-Parser.js
 */
import {describe, test} from '@jest/globals';
import {readFileSync} from "fs";
import {Parser} from "tetra-script";
import * as fs from "fs";

describe('Test simple parser suite:', () => {
  test('test-simple-arg-compile', () => {
    const strs = {
      'none: a': 'none: "a";',
      'none: a;': 'none: "a";',
      'none: 1;': 'none: 1;',
      'none: $a;': 'none: $a;',
      'none: "{a;}"': 'none: "{a;}";',
    }
    for (let str in strs) {
      const compileStr = Parser.compile(str).toString(2)
      expect(compileStr).toBe(strs[str]);
    }
  })

  test('test-simple-much-wrap', () => {
    const strs = {
      'none1: "temp1";\n\n\n\n\n':
        'none1: "temp1";'
    }
    for (let str in strs) {
      const compileResult = Parser.compile(str);
      expect(compileResult.toString(2)).toBe(strs[str]);
    }
  })

  test('test-simple-args-compile', () => {
    const strs = {
      'SetVar: "{a;}", "hello world"':
        'SetVar: "{a;}", "hello world";',
      'SetVar: abc, "hello world"':
        'SetVar: "abc", "hello world";',
      'SetVar: abc, $1':
        'SetVar: "abc", $1;',
      'SetVar: abc,$1':
        'SetVar: "abc", $1;',
      'evt.PreApplyAttack: {InvokeBuffEvent:PreApplyAttack_Begin,$arg0;}':
        'evt.PreApplyAttack: {\n' +
        '  InvokeBuffEvent: "PreApplyAttack_Begin", $arg0;\n' +
        '};'
    }
    for (let str in strs) {
      const compileStr = Parser.compile(str).toString(2)
      expect(compileStr).toBe(strs[str]);
    }
  })

  test('test-simple-much-compile', () => {
    const strs = {
      'none1: "temp1";none2: "temp2";':
        'none1: "temp1";\n' +
        'none2: "temp2";',
      'a: {b;};a: "temp2";':
        'a: {\n' +
        '  b;\n' +
        '};\n' +
        'a: "temp2";',
      'a: {b;};a: {b;};':
        'a: {\n' +
        '  b;\n' +
        '};\n' +
        'a: {\n' +
        '  b;\n' +
        '};',
      'a: {b;};\n':
        'a: {\n' +
        '  b;\n' +
        '};'
    }
    for (let str in strs) {
      const compileResult = Parser.compile(str);
      expect(compileResult.toString(2)).toBe(strs[str]);
    }
  })
})

describe('Test parser suite:', () => {
  test('test-compile-with-child', () => {
    const strs = {
      'a: {b: "c "}':
        'a: {\n' +
        '  b: "c ";\n' +
        '};',
      'SetVar: {GetVar: "temp ";}, "hello world";':
        'SetVar: {\n' +
        '  GetVar: "temp ";\n' +
        '}, "hello world";',
      'SetVar: {GetVar: "temp "}, "hello world";':
        'SetVar: {\n' +
        '  GetVar: "temp ";\n' +
        '}, "hello world";'
    }
    for (let str in strs) {
      const compileResult = Parser.compile(str);
      expect(compileResult.toString(2)).toBe(strs[str]);
    }
  })

  test('test-compile-with-many-child', () => {
    const strs = {
      'SetVar: {GetVar: {GetVar: {GetVar: "temp";};};}, "hello world";':
        'SetVar: {\n' +
        '  GetVar: {\n' +
        '    GetVar: {\n' +
        '      GetVar: "temp";\n' +
        '    };\n' +
        '  };\n' +
        '}, "hello world";',
      'SetVar: {GetVar: {GetVar: "temp";};}, {GetVar: {GetVar: "temp";};};':
        'SetVar: {\n' +
        '  GetVar: {\n' +
        '    GetVar: "temp";\n' +
        '  };\n' +
        '}, {\n' +
        '  GetVar: {\n' +
        '    GetVar: "temp";\n' +
        '  };\n' +
        '};'
    }
    for (let str in strs) {
      const compileResult = Parser.compile(str);
      expect(compileResult.toString(2)).toBe(strs[str]);
    }
  })

  test('test-compile', () => {
    const content = readFileSync('test/.data/test.min.tetraScript', 'utf8');
    const compileResult = Parser.compile(content);
    expect(compileResult.toString(2)+'\n').toBe(
      readFileSync('test/.data/test.tetraScript', 'utf8')
    );
  })

  test('test-long-compile', () => {
    const files = [
      'test/.data/test-long-1',
      'test/.data/test-long-2',
      'test/.data/test-long-3',
      'test/.data/test-long-4'
    ]
    files.forEach(file => {
      if (fs.existsSync(`${file}.tetraScript`)) {
        expect(Parser.compile(
          readFileSync(`${file}.min.tetraScript`, 'utf8')
        ).toString(2) + '\n').toBe(
          readFileSync(`${file}.tetraScript`, 'utf8')
        );
      } else {
        console.log(Parser.compile(
          readFileSync(`${file}.min.tetraScript`, 'utf8')
        ).toString(2));
      }
    });
  })
})

describe('Test characteristic parser suite:', () => {
  test('test-ignore-comma', () => {
    const strs = {
      'SetVar: {GetVar: "temp ";}"hello world";':
        'SetVar: {\n' +
        '  GetVar: "temp ";\n' +
        '}, "hello world";',
      'lf:{!=:{grev:_disable}true}':
        'lf: {\n' +
        '  !=: {\n' +
        '    grev: "_disable";\n' +
        '  }, "true";\n' +
        '};'
    }
    for (let str in strs) {
      const compileResult = Parser.compile(str);
      expect(compileResult.toString(2)).toBe(strs[str]);
    }
  })

  test('test-ignore-arguments', () => {
    const strs = {
      'SetVar;':
        'SetVar;'
    }
    for (let str in strs) {
      const compileResult = Parser.compile(str);
      expect(compileResult.toString(2)).toBe(strs[str]);
    }
  })

  test('test-expression', () => {
    const strs = {
      'if: {$x==1} {log: "hello"};':
        'if: {\n' +
        '  $x==1;\n' +
        '}, {\n' +
        '  log: "hello";\n' +
        '};',
      'if: {$x=={ArgIsCard:697}} {log: "hello"};':
        'if: {\n' +
        '  $x=={ ArgIsCard: 697; };\n' +
        '}, {\n' +
        '  log: "hello";\n' +
        '};',
      'if: {$x<={ArgIsCard:697}} {log: "hello"};':
        'if: {\n' +
        '  $x<={ ArgIsCard: 697; };\n' +
        '}, {\n' +
        '  log: "hello";\n' +
        '};',
    }
    for (let str in strs) {
      const compileResult = Parser.compile(str);
      expect(compileResult.toString(2)).toBe(strs[str]);
    }
  })

  test('test-has-comment', () => {
    const strs = {
      '// test\nSetVar;':
        '// test\n' +
        'SetVar;',
      'SetVar;\n// test':
        'SetVar;\n' +
        '// test',
      'SetVar;\n// test\nSetVar;':
        'SetVar;\n' +
        '// test\n' +
        'SetVar;',
      'SetVar;// test\nSetVar;':
        'SetVar;\n' +
        '// test\n' +
        'SetVar;',
      'SetVar: {\n// test\nGetVar: "temp";}, "123";':
        'SetVar: {\n' +
        '  // test\n' +
        '  GetVar: "temp";\n' +
        '}, 123;',
      // 'GetVar: // test\n':
      //   'GetVar: // test\n;',
      // 'SetVar: x, GetVar: // test\n;':
      //   'SetVar: "x", GetVar: // test\n;'
    }
    for (let str in strs) {
      const compileResult = Parser.compile(str);
      expect(compileResult.toString(2)).toBe(strs[str]);
    }
  })
})

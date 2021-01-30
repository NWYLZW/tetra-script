/**
 * @desc   test-Parser.js
 * @author yijie
 * @date   2021-01-30
 * @note   yijie 2021-01-30 Created the file test-Parser.js
 */
import {describe, test, it} from '@jest/globals';
import Parser from "../src/core/parser";
import {readFileSync} from "fs";

describe('Test simple parser suite:', () => {
  test('test-simple-compile', () => {
    const strs = {
      'none: a;':
        'none: "a";',
      'none: a':
        'none: "a";',
      'none: 1;':
        'none: 1;',
      'none: $a;':
        'none: $a;',
      'none: "{a;}"':
        'none: "{a;}";',
      'SetVar: "{a;}", "hello world"':
        'SetVar: "{a;}", "hello world";'
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
        'none2: "temp2";'
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
      console.log(
        compileResult.toString(2)
      )
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
    // console.log(Parser.compile(
    //   readFileSync('test/.data/test-long-1.min.tetraScript', 'utf8')
    // ).toString(2));
    // console.log(Parser.compile(
    //   readFileSync('test/.data/test-long-2.min.tetraScript', 'utf8')
    // ).toString(2));
    console.log(Parser.compile(
      readFileSync('test/.data/test-long-3.min.tetraScript', 'utf8')
    ).toString(2));
  })
})

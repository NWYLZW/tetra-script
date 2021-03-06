/**
 * @desc    jest配置文件 jest.config.js.js
 * @author  yijie
 * @date    2021-01-09 19:07
 * @logs[0] 2021-01-09 19:07 yijie 创建了jest.config.js.js文件
 */
import type { Config } from '@jest/types';
import * as path from "path";

const config: Config.InitialOptions = {
  verbose: true,
  moduleNameMapper: {
    'tetra-script/(.*)': path.join(__dirname, './src/$1'),
    'tetra-script': path.join(__dirname, './src/index')
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: [
    "/test/.data"
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
export default config;

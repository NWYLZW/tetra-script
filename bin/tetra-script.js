#!/usr/bin/env node
/**
 * @desc   tetra-script.js
 * @author yijie
 * @date   2021-02-03
 * @note   yijie 2021-02-03 Created the file tetra-script.js
 */
const program = require('commander')

program
  .version(
    require('../package').version
  ).usage(
    '<command> [options]'
  ).command(
    'format', 'format tetraScript.'
  )

program.parse(process.argv)

#!/usr/bin/env node
/**
 * @desc   tetra-script.js
 * @author yijie
 * @date   2021-02-03
 * @note   yijie 2021-02-03 Created the file tetra-script.js
 */
const fs = require("fs");
const glob = require("glob");

const program = require('commander');
const commonPath = require('common-path');

const { Parser } = require("../dist");

program
  .version(
    require('../package').version
  ).usage(
    '<command> [options]'
  ).option(
    '-d, --dot', 'whether to search hidden directories.'
  ).option(
    '-i, --indent [number]', 'set indent number.', '2'
  ).option(
    '-o, --output [path]', 'set output path.', './'
  ).option(
    '-f, --files <file...>', 'set input files(stand by glob).'
  );

program.parse(process.argv);

const opts = program.opts();

const allFiles = []
opts['files'].forEach(globRule => {
  allFiles.push(
    ...glob.sync(globRule, {
      dot: opts['dot']
    })
  );
});
const commonPathResult = commonPath.posix(allFiles);
commonPathResult.parsedPaths.forEach(parsedPath => {
  const resultContent = Parser.compile(
    fs.readFileSync(parsedPath.original, 'utf8')
  ).toString(opts.indent);
  const parentPath = opts['output'] + '/' + parsedPath.subPart;
  const outputFilePath = parentPath + parsedPath.namePart + '.tetraScript';
  fs.mkdirSync(parentPath, {
    recursive: true
  });
  fs.writeFileSync(outputFilePath, resultContent);
  console.log(`Writing: ${outputFilePath}.`);
});
console.log("Formatted successfully.");

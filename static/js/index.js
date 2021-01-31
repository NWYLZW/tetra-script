/**
 * @desc      index.js
 * @author    fengzili
 * @date      2021-01-31
 * @logs[0]   fengzili 2021-01-31 创建了文件index.js
 */

require(['../../dist/index'], function (tetraScript) {
  var Parser = tetraScript.Parser;
  formatBtn.addEventListener(
    "click", function () {
      var content = inputTextArea.value;
      var compileStr = Parser.compile(content);
      outputTextArea.value = compileStr.toString(2);
    })
});

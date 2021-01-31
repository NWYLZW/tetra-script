/**
 * @desc      index.js
 * @author    fengzili
 * @date      2021-01-31
 * @logs[0]   fengzili 2021-01-31 创建了文件index.js
 */
require.config({
  baseUrl: './static/js/lib',
  paths: {
    'ace': 'ace',
    'tetra-script': 'tetra-script'
  },
})

require([
  'tetra-script/index', 'ace/ace', 'ace/ext/modelist'
], function (tetraScript, ace) {
  function generateEditor() {
    var editor = ace.edit("editor", {
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
      tabSize: 2
    });
    editor.setTheme("ace/theme/xcode");
    editor.getSession().setMode('ace/mode/javascript');
    editor.commands.addCommand({
      name: "format",
      bindKey: { win: "Ctrl-Shift-f", mac: "Command-Shift-f" },
      exec: function (editor) {
        var content = editor.getValue();
        var compileStr = Parser.compile(content);
        editor.setValue(compileStr.toString(2));
      }
    });
    return editor;
  }

  var Parser = tetraScript.Parser;
  var editor = generateEditor();

  formatBtn.addEventListener(
    "click", function () {
      var content = editor.getValue();
      var compileStr = Parser.compile(content);
      editor.setValue(compileStr.toString(2));
    });
  lightThemeBtn.addEventListener(
    "click", function () {
      editor.setTheme("ace/theme/xcode");
    });
  darkThemeBtn.addEventListener(
    "click", function () {
      editor.setTheme("ace/theme/nord_dark");
    });
});

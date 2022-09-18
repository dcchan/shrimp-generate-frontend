<template>
    <div>
        <div ref="editorWrapper" style="width:100%; height:300px"></div>
    </div>
</template>
<script setup>
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { nextTick } from "vue";
// import { color } from "monaco-editor/esm/vs/editor/editor.api.js";
const props = defineProps(['modelValue', 'config']);
const emit = defineEmits(['update:modelValue']);

const editorWrapper = ref();
let editor = {};
const config =  {
  language: "java", // 语⾔⽀持⾃⾏查阅 demo
  theme: "hc-black", // 官⽅⾃带三种主题 vs, hc-black, or vs-dark
  selectOnLineNumbers: true, // 显⽰⾏号
  roundedSelection: false,
  readOnly: false, // 只读
  cursorStyle: "line", // 光标样式
  automaticLayout: false, // ⾃动布局
  glyphMargin: true, // 字形边缘
  useTabStops: false,
  fontSize: 12, // 字体⼤⼩
  autoIndent: true, // ⾃动布局
  quickSuggestionsDelay: 100, // 代码提⽰延时
  ...props.config
};

function initTempContentEditor() {
  console.log(editorWrapper);
  editor = monaco.editor.create(editorWrapper.value, {
    value: props.modelValue, // 编辑器初始显⽰⽂字
    ...config
  });
  // 监听值的变化
  editor.onDidChangeModelContent((event) => {
    getEditorVal()
  });
  console.log(editor);
}
function getEditorVal() {
  emit('update:modelValue', toRaw(editor).getValue());
}

nextTick(() => {
  initTempContentEditor();
});
</script>
<template>
    <div ref="codeEditorBox" style="width:100%; height:800px"></div>
</template>
<script setup lang="jsx"  name="MonacoEditor">
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";

const props = defineProps({
  value: {
    type: String, // 需要指定类型
    default: '', // 建议指定默认值
  },
  language: {
    type: String, // 需要指定类型
    default: 'html',
  },
});

const emit = defineEmits(['change']);
// defineExpose({setValue})
const { proxy } = getCurrentInstance();
const initCode = ref(null);
const codeEditor = ref(null);

onMounted(() => {
  initCodeEditor();
})

watch(() => props.value, val => {
  console.log(val);
  if (codeEditor.value) {
    setValue(val);
  }
}, {
  immediate: true // 变化后立即执行动作
});

function initCodeEditor() {
  const codeEditorBox = proxy.$refs['codeEditorBox']
  codeEditor.value = monaco.editor.create(codeEditorBox, {
    value: props.value, // 编辑器初始显⽰⽂字
    language: props.language, // 语⾔⽀持⾃⾏查阅 demo
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
  });
  // 监听值的变化
  codeEditor.value.onDidChangeModelContent((event) => {
    getValue()
  });
}
function getValue() {
  const value =  toRaw(codeEditor.value).getValue();
  emit("change", value);
}
function setValue(val) {
  toRaw(codeEditor.value).setValue(val);
}
</script>

<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
        <el-form-item prop="databaseHost">
          <el-input v-model="queryParams.router" placeholder="路由" clearable style="width: 240px" @keyup.enter="handleQuery"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
     <div>
       <div id="codeEditBox" style="width:100%;height:600px"></div>
     </div>
   </div>
</template>

<script setup name="apiCodeV3">
import { apisCodeV3 } from "@/api/spring";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";

const editor = ref(null);
const form = ref({});
const queryParams = ref({
  router: '/generate',
});
/** 搜索按钮操作 */
function handleQuery() {
  getApiCode();
}
/** 修改按钮操作 */
function getApiCode() {
  apisCodeV3(queryParams.value).then(res => {
    form.value.code = res.data;
    setEditorVal(res.data);
  });
}

onMounted(() => {
  initCodeEditor();
});

function initCodeEditor() {
  if (editor.value) {
    return;
  }
  var codeEditBox = document.getElementById("codeEditBox");
  editor.value = monaco.editor.create(codeEditBox, {
    value: form.value.code, // 编辑器初始显⽰⽂字
    language: "javascript", // 语⾔⽀持⾃⾏查阅 demo
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
  editor.value.onDidChangeModelContent((event) => {
    getEditorVal()
  });
}

function getEditorVal() {
  const val = toRaw(editor.value).getValue();
  form.value.javascript = val;
}

function setEditorVal(val) {
  toRaw(editor.value).setValue(val);
}

</script>

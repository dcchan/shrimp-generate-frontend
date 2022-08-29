<template>
  <div class="app-container" style="padding: 0px">
    <el-row :gutter="20">
      <!--数据库信息-->
      <el-col :span="10" :xs="24">
        <div id="sqlEditBox" style="width:100%; height:800px"></div>
      </el-col>
      <el-col :span="4" :xs="24">
        <div>请选择模板，生成代码</div>
        <el-table :data="templateList" :show-header="false" @cell-click="templateRow" :row-class-name="tableRowClassName">
          <el-table-column align="left" prop="tempName" width="220" :show-overflow-tooltip="true">
            <template #default="scope">
              <el-tooltip class="box-item" effect="dark" placement="top-start" :content="scope.row.tempType + ':' + scope.row.tempSubfix">
                <span>{{scope.row.tempName}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="10" :xs="24">
        代码生成的结果-未完成
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="jsx">
import { templateSystemAndCustomOptions } from "@/api/generate";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";

const { proxy } = getCurrentInstance();
defineExpose({setData})

const database = ref({});
const templateList = ref([]);
const sqlEditor = ref(null);

const form = ref({});

function setData(val) {
  if (!val) {
    return;
  }
  database.value = val;
  form.databaseId = database.value.id;
  getTemplates();
  initsqlEditor();
}

function getTemplates() {
  templateSystemAndCustomOptions({}).then(res => {
    templateList.value = res.data;
  })
}

function initsqlEditor() {
  const sqlEditBox = document.getElementById("sqlEditBox");
  sqlEditor.value = monaco.editor.create(sqlEditBox, {
    value: 'select 1 from dual', // 编辑器初始显⽰⽂字
    language: "sql", // 语⾔⽀持⾃⾏查阅 demo
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
  sqlEditor.value.onDidChangeModelContent((event) => {
    getSqlEditorVal()
  });
}

function getSqlEditorVal() {
  const val = toRaw(sqlEditor.value).getValue();
  form.value.sql = val;
}

function setSqlEditorVal(val) {
  toRaw(sqlEditor.value).setValue(val);
}


function templateRow(row) {
  form.value.templateId = row.id;
}

function tableRowClassName(row, rowIndex){
  if (row.row.id === form.value.templateId) {
    return 'selected-row'
  }
  return ''
}


</script>


<style>
.el-table .selected-row {
  --el-table-tr-bg-color: var(--el-color-primary-light-6);
}
</style>

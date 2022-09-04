<template>
  <el-row :gutter="20">
    <el-col :span="10" :xs="24">
      <monaco-editor language="sql" @change="changeCode" width="500px" height="680px"/>
    </el-col>
    <el-col :span="4" :xs="24">
      <div><el-button type="primary" icon="Search" @click="genCode">生成代码</el-button></div>
      <el-table :data="templateList" :show-header="false" @cell-click="genCode" :row-class-name="tableRowClassName">
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
      <monaco-editor v-model="codeResult" language="sql" width="500px" height="680px"/>
    </el-col>
  </el-row>
</template>

<script setup lang="jsx">
import { templateSystemAndCustomOptions, databaseSqlAnalysis } from "@/api/generate";

import MonacoEditor from '@/components/MonacoEditor'

const { proxy } = getCurrentInstance();
defineExpose({setData})

const database = ref({});
const templateList = ref([]);
const form = ref({});
const codeResult = ref(null);

function setData(val) {
  if (!val) {
    return;
  }
  database.value = val;
  form.value.databaseId = database.value.id;
  form.value.sql = "select 10 from dual";
  getTemplates();
}

function getTemplates() {
  templateSystemAndCustomOptions({}).then(res => {
    templateList.value = res.data;
  })
}

function genCode(row) {
  form.value.templateId = row.id;
  generateCode();
}

function changeCode(code) {
  form.value.sql = code;
}

function generateCode() {
  if (!form.value.sql) {
    codeResult.value = '请先填写 SQL';
    return;
  }
  if (!form.value.templateId) {
    codeResult.value = '请先选择模板';
    return;
  }
  databaseSqlAnalysis(form.value).then(res => {
    codeResult.value = res.data.code;
  })
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

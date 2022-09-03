<template>
  <el-row :gutter="20">
    <el-col :span="10" :xs="24">
      <monaco-editor value="select * from dual" language="sql" @change="changeCode"/>
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
</template>

<script setup lang="jsx">
import { templateSystemAndCustomOptions } from "@/api/generate";
import MonacoEditor from '@/components/MonacoEditor'

const { proxy } = getCurrentInstance();
defineExpose({setData})

const database = ref({});
const templateList = ref([]);
const form = ref({});

function setData(val) {
  if (!val) {
    return;
  }
  database.value = val;
  form.databaseId = database.value.id;
  getTemplates();
}

function getTemplates() {
  templateSystemAndCustomOptions({}).then(res => {
    templateList.value = res.data;
  })
}
function changeCode(val) {
  console.log('changeCode', val);
  form.value.sql = val;
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

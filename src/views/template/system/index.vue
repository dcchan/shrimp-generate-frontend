<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
        <!--
        <el-form-item prop="tempType">
          <el-select v-model="queryParams.tempType" placeholder="模板类型" clearable style="width: 100px" @keyup.enter="handleQuery">
            <el-option v-for="item in TempType" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        -->
        <el-form-item prop="tempName">
          <el-input v-model="queryParams.tempName" placeholder="模板名称" clearable style="width: 300px" @keyup.enter="handleQuery"/>
        </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>

      <el-table width="100%" v-loading="loading" :data="dataList">
        <el-table-column label="ID" align="center" prop="id" width="80"/>
        <el-table-column label="模板类型" align="center" prop="tempType" width="100" :show-overflow-tooltip="true">
          <template #default="scope"><dict-tag :options="TempType" :value="scope.row.tempType" /></template>
        </el-table-column>
        <el-table-column label="模板名称" align="left" prop="tempName" :show-overflow-tooltip="true" />
        <el-table-column label="模板说明" align="left" prop="tempDesc" :show-overflow-tooltip="true" />
        <el-table-column label="模板后缀" align="left" prop="tempSubfix" width="200" :show-overflow-tooltip="true"/>
        <el-table-column label="备注" align="left" prop="comments" width="200" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
          <template #default="scope"><span>{{ parseTime(scope.row.createTime) }}</span></template>
        </el-table-column>
        <el-table-column label="修改时间" align="center" prop="updateTime" width="160">
          <template #default="scope"><span>{{ parseTime(scope.row.updateTime) }}</span></template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="150" class-name="small-padding fixed-width">
          <template #default="scope">
             <el-button type="text" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
             <el-button type="text" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <EditDialog v-if="open" :open="open" :title="title" :form="form"></EditDialog>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.current" v-model:limit="queryParams.size" @pagination="getList"/>
   </div>
</template>

<script setup name="templateSystemPage">
import {
  templateSystemInfo,
  templateSystemPage,
  templateSystemRemove,
  templateSystemSave
} from "@/api/generate";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import TempType from '@/mock/dict/TempType'
import EditDialog from "./editDialog.vue";

const { proxy } = getCurrentInstance();

const dataList = ref([]);
const loading = ref(false);
const total = ref(0);
const open = ref(false);
const title = ref("");
const form = ref({});

const queryParams = ref({
  current: 1,
  size: 10,
  tempName: undefined,
});

/** 查询参数列表 */
function getList() {
  loading.value = true;
  templateSystemPage(queryParams.value).then(res => {
    dataList.value = res.data.rows;
    total.value = res.data.total;
  }).finally(val => {
    loading.value = false;
  });
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.current = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加";
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  templateSystemInfo({id: row.id}).then(res => {
    form.value = res.data;
    open.value = true;
    title.value = "修改";
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除"' + row.tempName + '"？').then(function () {
    templateSystemRemove({id: row.id}).then(res => {
      if (res.code !== 1) {
        proxy.$modal.msgError("删除失败：" + res.msg);
      } else {
        getList();
        proxy.$modal.msgSuccess("删除成功");
      }
    })
  }).catch(() => {});
}

/** 表单重置 */
function reset() {
  form.value = {};
}

getList();
</script>

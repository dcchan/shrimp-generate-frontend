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
          <el-input v-model="queryParams.tempName" placeholder="模板名称" clearable style="width: 160px" @keyup.enter="handleQuery"/>
        </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="dataList">
        <el-table-column label="ID" align="center" prop="id" width="80"/>
        <el-table-column label="模板类型" align="center" prop="tempType" width="100" :show-overflow-tooltip="true">
          <template #default="scope">
            <dict-tag :options="TempType" :value="scope.row.tempType" />
          </template>
        </el-table-column>
        <el-table-column label="模板名称" align="left" prop="tempName" width="200" :show-overflow-tooltip="true" />
        <el-table-column label="模板说明" align="left" prop="tempDesc" width="200" :show-overflow-tooltip="true" />
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
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.current" v-model:limit="queryParams.size" @pagination="getList"/>

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" v-model="open" @opened="initTempContentEditor" width="1200px" append-to-body>
         <el-form ref="editRef" :model="form" :rules="rules" label-width="100px">
           <el-row :gutter="20">
             <el-col :sm="24" :lg="12" style="padding-left: 20px">
               <el-form-item label="模板类型" prop="tempType">
                 <el-input v-model="form.tempType" placeholder="请输入模板类型" />
               </el-form-item>
             </el-col>
             <el-col :sm="24" :lg="12" style="padding-left: 20px">
               <el-form-item label="模板名称" prop="tempName">
                 <el-input v-model="form.tempName" placeholder="请输入模板名称" />
               </el-form-item>
             </el-col>
             <el-col :sm="24" :lg="12" style="padding-left: 20px">
               <el-form-item label="文件后缀" prop="tempSubfix">
                 <el-input v-model="form.tempSubfix" placeholder="请输入文件后缀" />
               </el-form-item>
             </el-col>
             <el-col :sm="24" :lg="12" style="padding-left: 20px">
               <el-form-item label="模板描述" prop="tempDesc">
                 <el-input v-model="form.tempDesc" placeholder="请输入模板描述" />
               </el-form-item>
             </el-col>
           </el-row>
           <el-form-item label="备注" prop="comments">
             <el-input v-model="form.comments" type="textarea" placeholder="请输入备注" />
           </el-form-item>
           <div id="tempContentEditBox" v-if="open" style="width:100%; height:300px"></div>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitForm">确 定</el-button>
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<script setup name="templateSystemPage">
import {templateSystemInfo, templateSystemPage, templateSystemRemove, templateSystemSave} from "@/api/generate";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import TempType from '@/mock/dict/TempType'

const { proxy } = getCurrentInstance();

const dataList = ref([]);
const open = ref(false);
const loading = ref(false);
const total = ref(0);
const title = ref("");
const editor = ref(null);

const form = ref({});
const queryParams = ref({
  current: 1,
  size: 10,
  tempName: undefined,
});
const rules = {
  tempType: [{ required: true, message: "模板类型不能为空", trigger: "blur" }],
  tempName: [{ required: true, message: "模板名称不能为空", trigger: "blur" }],
  tempSubfix: [{ required: true, message: "模板后缀不能为空", trigger: "blur" }],
  tempDesc: [{ required: true, message: "模板说明不能为空", trigger: "blur" }],
  tempContent: [{ required: true, message: "模板内容不能为空", trigger: "blur" }],
}

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
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {};
  proxy.resetForm("editRef");
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

/** 提交按钮 */
function submitForm() {
  proxy.$refs["editRef"].validate(valid => {
    if (valid) {
      templateSystemSave(form.value).then(res => {
        if (res.code === 1) {
          proxy.$modal.msgSuccess(form.value.id === undefined ? "新增成功" : "修改成功");
          open.value = false;
          getList();
        } else if (res.code === 0) {
          proxy.$moda.msgWarning(res.msg);
        } else {
          proxy.$moda.msgError(res.msg);
        }
      });
    }
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


function initTempContentEditor() {
  var tempContentEditBox = document.getElementById("tempContentEditBox");
  editor.value = monaco.editor.create(tempContentEditBox, {
    value: form.value.tempContent, // 编辑器初始显⽰⽂字
    language: "xml", // 语⾔⽀持⾃⾏查阅 demo
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
  form.value.tempContent = toRaw(editor.value).getValue();
}

function setEditorVal(val) {
  toRaw(editor.value).setValue(val);
}

getList();
</script>

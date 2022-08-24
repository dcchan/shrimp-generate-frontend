<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
        <el-form-item prop="databaseHost">
          <el-input v-model="queryParams.databaseHost" placeholder="主机" clearable style="width: 240px" @keyup.enter="handleQuery"/>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="queryParams.username" placeholder="用户名" clearable style="width: 160px" @keyup.enter="handleQuery"/>
        </el-form-item>
        <el-form-item prop="tableSchema">
          <el-input v-model="queryParams.tableSchema" placeholder="数据库名称" clearable style="width: 160px" @keyup.enter="handleQuery"/>
        </el-form-item>
         <el-form-item style="width: 352px;">
            <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange" range-separator="-" start-placeholder="开始" end-placeholder="结束"></el-date-picker>
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
        <el-table-column label="类型" align="center" prop="databaseType" width="100" :show-overflow-tooltip="true" />
        <el-table-column label="主机" align="center" prop="databaseHost" width="300" :show-overflow-tooltip="true" />
        <el-table-column label="端口" align="center" prop="databasePort" width="80"/>
        <el-table-column label="用户名" align="center" prop="username" width="160" :show-overflow-tooltip="true" />
        <el-table-column label="数据库名称" align="center" prop="tableSchema" width="160" :show-overflow-tooltip="true" />
        <el-table-column label="前缀" align="center" prop="prefix" width="80" :show-overflow-tooltip="true" />
        <el-table-column label="忽略的字段" align="center" prop="ignoreCloumns" width="160" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
          <template #default="scope"><span>{{ parseTime(scope.row.createTime) }}</span></template>
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
      <el-dialog :title="title" v-model="open" width="800px" append-to-body>
         <el-form ref="editRef" :model="form" :rules="rules" label-width="100px">

           <el-row :gutter="20">
             <el-col :sm="24" :lg="12" style="padding-left: 20px">
               <el-form-item label="类型" prop="databaseType">
                 <el-input v-model="form.databaseType" placeholder="请输入类型" />
               </el-form-item>
             </el-col>
             <el-col :sm="24" :lg="12" style="padding-left: 20px">
               <el-form-item label="主机" prop="databaseHost">
                 <el-input v-model="form.databaseHost" placeholder="请输入主机" />
               </el-form-item>
             </el-col>
             <el-col :sm="24" :lg="12" style="padding-left: 20px">
               <el-form-item label="端口" prop="databasePort">
                 <el-input type="number" v-model="form.databasePort" placeholder="请输入用户名" />
               </el-form-item>
             </el-col>
             <el-col :sm="24" :lg="12" style="padding-left: 20px">
               <el-form-item label="数据库名称" prop="tableSchema">
                 <el-input v-model="form.tableSchema" placeholder="请输入数据库名称" />
               </el-form-item>
             </el-col>
             <el-col :sm="24" :lg="12" style="padding-left: 20px">
               <el-form-item label="用户名" prop="username">
                 <el-input v-model="form.username" placeholder="请输入用户名" />
               </el-form-item>
             </el-col>
             <el-col :sm="24" :lg="12" style="padding-left: 20px">
               <el-form-item label="密码" prop="password">
                 <el-input type="password" v-model="form.password" placeholder="请输入密码" />
               </el-form-item>
             </el-col>
           </el-row>
            <el-form-item label="备注" prop="comments">
               <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="test">测 试</el-button>
               <el-button type="primary" @click="submitForm">确 定</el-button>
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<script setup name="databasePage">
import { databasePage, databaseInfo, databaseSave, databaseRemove, databaseTest } from "@/api/generate";
const { proxy } = getCurrentInstance();

const dataList = ref([]);
const open = ref(false);
const loading = ref(false);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);

const form = ref({});
const queryParams = ref({
  current: 1,
  size: 10,
  databaseHost: undefined,
  username: undefined,
  tableSchema: undefined,
});
const rules = {
  databaseType: [{ required: true, message: "数据库类型不能为空", trigger: "blur" }],
  databaseHost: [{ required: true, message: "主机地址不能为空", trigger: "blur" }],
  databasePort: [{ required: true, message: "端口不能为空", trigger: "blur" }],
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
  tableSchema: [{ required: true, message: "数据库名称不能为空", trigger: "blur" }],
}

/** 查询参数列表 */
function getList() {
  loading.value = true;
  databasePage(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
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
  databaseInfo({id: row.id}).then(res => {
    form.value = res.data;
    open.value = true;
    title.value = "修改";
  });
}
function test() {
  proxy.$refs["editRef"].validate(valid => {
    if (valid) {
      databaseTest(form.value).then(res => {
        if (res.code === 1) {
          proxy.$modal.msgSuccess('连接成功');
        } else {
          proxy.$moda.msgError(res.msg);
        }
      });
    }
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["editRef"].validate(valid => {
    if (valid) {
      databaseSave(form.value).then(res => {
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
  proxy.$modal.confirm('是否确认删除编号为"' + row.id + '"的数据项？').then(function () {
    databaseRemove({id: row.id}).then(res => {
      if (res.code !== 1) {
        proxy.$modal.msgError("删除失败：" + res.msg);
      } else {
        getList();
        proxy.$modal.msgSuccess("删除成功");
      }
    })
  }).catch(() => {});
}

getList();
</script>

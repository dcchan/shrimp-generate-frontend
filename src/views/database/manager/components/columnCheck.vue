<template>
  <el-table :data="columnList">
    <el-table-column label="字段名" align="left" prop="columnName" width="120" :show-overflow-tooltip="true"/>
    <el-table-column label="字段数量" align="center" prop="count" width="80"/>
    <el-table-column label="字符集" align="center" prop="collationNames" width="300">
      <template #default="scope">
        <span v-for="name in scope.row.collationNameList" style="margin: 10px">
          <el-tag class="ml-2" round :type="scope.row.collationNameList.length === 1 ? '':'danger'">{{name}}</el-tag>
        </span>
      </template>
    </el-table-column>
    <el-table-column label="字段类型" align="center" prop="columnTypes" width="300">
      <template #default="scope">
        <span v-for="name in scope.row.columnTypeList">
          <el-tag class="ml-2" round :type="scope.row.columnTypeList.length === 1 ? '':'danger'">{{name}}</el-tag>
        </span>
      </template>
    </el-table-column>
    <el-table-column label="备注" align="center" prop="columnComments" width="300">
      <template #default="scope">
        <span v-for="name in scope.row.columnCommentList">
          <el-tag class="ml-2" round :type="scope.row.columnCommentList.length === 1 ? '':'danger'">{{name}}</el-tag>
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="jsx">
import { databaseColumnCheck } from "@/api/generate";

const { proxy } = getCurrentInstance();
defineExpose({setData})

const database = ref({});
const columnList = ref([]);

function setData(val) {
  if (!val) {
    return;
  }
  database.value = val;
  databaseColumnCheck({id: database.value.id}).then(res => {
    columnList.value = res.data;
    for (const column of columnList.value) {
      if (column.collationNames) {
        column.collationNameList = column.collationNames.split("&&");
      }
      if (column.columnTypes) {
        column.columnTypeList = column.columnTypes.split("&&");
      }
      if (column.columnComments) {
        column.columnCommentList = column.columnComments.split("&&");
      }
    }
  })
}

</script>

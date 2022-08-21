<template>

  <el-row :gutter="12">
    <el-col :span="12">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{database.schema}}</span>
            <!--
            <el-button class="button" text>Operation button</el-button>
            -->
          </div>
        </template>
        <el-table v-loading="loading" :data="tableList">
          <el-table-column label="表空间" align="center" prop="tableSchema" width="160" :show-overflow-tooltip="true"/>
          <el-table-column label="表名" align="center" prop="tableName" width="120" :show-overflow-tooltip="true"/>
          <el-table-column label="备注" align="center" prop="tableComment" width="120" :show-overflow-tooltip="true"/>
          <el-table-column label="字符集" align="center" prop="tableCollation" width="128"/>
          <el-table-column label="引擎" align="center" prop="engine" width="80"/>
          <el-table-column label="行数" align="center" prop="tableRows" width="80"/>
          <el-table-column label="平均行长度" align="center" prop="avgRowLength" width="120"/>
          <el-table-column label="数据长度" align="center" prop="dataLength" width="120"/>
          <el-table-column label="最大数据长度" align="center" prop="maxDataLength" width="120"/>
          <el-table-column label="索引长度" align="center" prop="indexLength" width="80"/>
          <el-table-column label="碎片数" align="center" prop="dataFree" width="80"/>
          <el-table-column label="自增长" align="center" prop="autoIncrement" width="80"/>
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template #default="scope"><span>{{ parseTime(scope.row.createTime) }}</span></template>
          </el-table-column>
          <el-table-column label="更新时间" align="center" prop="updateTime" width="160">
            <template #default="scope"><span>{{ parseTime(scope.row.updateTime) }}</span></template>
          </el-table-column>
        </el-table>
      </el-card>


    </el-col>
    <el-col :span="12">
      字段
    </el-col>
  </el-row>
</template>

<script setup lang="jsx">
import { databaseTables } from "@/api/generate";

const { proxy } = getCurrentInstance();
defineExpose({setData})

const database = ref({});
const tableList = ref([]);

function setData(val) {
  if (!val) {
    return;
  }
  database.value = val;
  databaseTables({id: database.value.id}).then(res => {
    tableList.value = res.data;
  })
}
</script>

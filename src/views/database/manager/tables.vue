<template>
  <div class="app-container" style="padding: 0px">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{database.tableSchema}}</span>
        </div>
      </template>
      <el-table :data="tableList" @cell-click="getColumns">
        <el-table-column label="表名" align="left" prop="tableName" width="120" :show-overflow-tooltip="true"/>
        <el-table-column label="备注" align="left" prop="tableComment" width="120" :show-overflow-tooltip="true"/>
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
        <el-table-column label="操作" fixed="right" align="center" width="80" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button type="text" icon="Edit" @click="getColumns(scope.row)">字段</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :title="table.tableName" v-model="open" width="1200px" append-to-body>
      <el-table :data="columnList">
          <el-table-column label="表空间" align="center" prop="tableSchema" width="160" :show-overflow-tooltip="true"/>
          <el-table-column label="表名" align="left" prop="tableName" width="120" :show-overflow-tooltip="true"/>
          <el-table-column label="字段名" align="left" prop="columnName" width="120" :show-overflow-tooltip="true"/>
          <el-table-column label="默认值" align="left" prop="columnDefault" width="120" :show-overflow-tooltip="true"/>
          <el-table-column label="备注" align="left" prop="columnComment" width="120" :show-overflow-tooltip="true"/>
          <el-table-column label="可为空" align="center" prop="isNullable" width="120"/>
          <el-table-column label="数据类型" align="center" prop="dataType" width="120"/>
          <el-table-column label="字符最大长度" align="center" prop="characterMaximumLength" width="120"/>
          <el-table-column label="二进制最大长度" align="center" prop="characterOctetLength" width="120"/>
          <el-table-column label="数字精度" align="center" prop="numericPrecision" width="120"/>
          <el-table-column label="数字标度" align="center" prop="numericScale" width="120"/>
          <el-table-column label="时间精度" align="center" prop="datetimePrecision" width="120"/>
          <el-table-column label="字符集" align="center" prop="characterSetName" width="120"/>
          <el-table-column label="排序规则" align="center" prop="collationName" width="128" :show-overflow-tooltip="true"/>
          <el-table-column label="字段类型" align="center" prop="columnType" width="120"/>
          <el-table-column label="字段定义" align="center" prop="columnKey" width="120"/>
          <el-table-column label="扩展" align="center" prop="extra" width="120" :show-overflow-tooltip="true"/>
        </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="jsx">
import { databaseTables, databaseTableColumns } from "@/api/generate";

const { proxy } = getCurrentInstance();
defineExpose({setData})

const database = ref({});
const tableList = ref([]);

const table = ref({});
const columnList = ref([]);
const open = ref(false);

function setData(val) {
  if (!val) {
    return;
  }
  database.value = val;
  databaseTables({id: database.value.id}).then(res => {
    tableList.value = res.data;
  })
}

function getColumns(row) {
  table.value = row;
  open.value = true;
  databaseTableColumns({id: database.value.id, tableName: table.value.tableName}).then(res => {
    columnList.value = res.data;
  })
}

</script>

<template>
  <div class="head-container">
    <el-input v-model="queryParams.keyword" placeholder="回车查询" clearable prefix-icon="Search" style="margin-bottom: 20px" @keyup.enter="getDatabaseList"/>
  </div>
  <div class="head-container">
    <el-table v-loading="loading" :data="dataList" :show-header="false" @cell-click="selectRow" :row-class-name="tableRowClassName">
      <el-table-column align="left" prop="databaseName" width="220" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-tooltip class="box-item" effect="dark" placement="top-start" :content="scope.row.databaseHost + ':' + scope.row.databasePort">
            <span>{{scope.row.tableSchema}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup name="DatabaseSelect">
import { databaseList } from "@/api/generate";

const router = useRouter();
const { proxy } = getCurrentInstance();
const emit = defineEmits(['change']);

const loading = ref(false);
const database = ref({});
const dataList = ref([]);
const queryParams = ref({
  keyword: undefined,
});

function getDatabaseList() {
  loading.value = true;
  databaseList(queryParams.value).then(res => {
    dataList.value = res.data;
    if (dataList.value.length > 0) {
      selectRow(dataList.value[0]);
    }
  }).finally((val) => {
    loading.value = false;
  })
}

function selectRow(row) {
  database.value = row;
  emit("change", row);
}

function tableRowClassName(row, rowIndex){
  if (row.row.tableSchema === database.value.tableSchema) {
    return 'selected-row'
  }
  return ''
}

getDatabaseList();
</script>

<style>
.el-table .selected-row {
  --el-table-tr-bg-color: var(--el-color-primary-light-6);
}
</style>

<template>
   <div class="app-container">
      <el-row :gutter="20">
         <!--数据库信息-->
         <el-col :span="4" :xs="24">
            <div class="head-container">
               <el-input v-model="queryParams.keyword" placeholder="查询" clearable prefix-icon="Search" style="margin-bottom: 20px" @keyup.enter="getDatabaseList"/>
            </div>
            <div class="head-container">
              <el-table v-loading="loading" :data="abList" :show-header="false" @cell-click="selectRow">
                <el-table-column align="center" prop="databaseName" width="220" :show-overflow-tooltip="true">
                  <template #default="scope">
                    <el-tooltip class="box-item" effect="dark" placement="top-start"
                                :content="scope.row.databaseHost + ':' + scope.row.databasePort">
                      <span>{{scope.row.databaseName}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
         </el-col>
         <!--数据库操作-->
         <el-col :span="20" :xs="24">
           <el-tabs
               v-model="activeName"
               type="border-card"
               class="demo-tabs"
               @tab-click="setTabsData"
           >
             <el-tab-pane label="数据库表" name="tables">
               <tables ref="tablesRef"/>
             </el-tab-pane>
             <el-tab-pane label="Tab2" name="tab2">Tab2</el-tab-pane>
             <el-tab-pane label="Tab3" name="tab3">Tab3</el-tab-pane>
             <el-tab-pane label="Tab4" name="tab4">Tab4</el-tab-pane>
             <el-tab-pane label="Tab5" name="tab5">Tab5</el-tab-pane>
           </el-tabs>
         </el-col>
      </el-row>

   </div>
</template>

<script setup name="DatabaseManager">
import tables from './tables';
import { databaseList } from "@/api/generate";

const router = useRouter();
const { proxy } = getCurrentInstance();

const abList = ref([]);
const loading = ref(false);
const activeName = ref('tables');

const queryParams = ref({
  keyword: undefined,
});

function getDatabaseList() {
  loading.value = true;
  databaseList(queryParams.value).then(res => {
    abList.value = res.data;
    if (abList.value.length > 0) {
      selectRow(abList.value[0]);
    }
  }).finally(val => {
    loading.value = false;
  });
}

function selectRow(row) {
  activeName.value = 'tables';
  const refStr = activeName.value + 'Ref';
  proxy.$refs[refStr].setData(row);
}

function setTabsData(pane, event) {
  /*
  if (pane) {
    activeName.value = pane.props.name;
  }
  const refStr = activeName.value + 'Ref';
  proxy.$refs[refStr].setData(device.value.snNo);
  */
}


getDatabaseList();
</script>

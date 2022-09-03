<template>
   <div class="app-container">
      <el-row :gutter="20">
         <el-col :span="3" :xs="24">
           <database-select @change="selectRow"/>
         </el-col>
         <!--数据库操作-->
         <el-col :span="21" :xs="24">
           <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-click="setTabsData">
             <el-tab-pane label="数据表" name="tables"><tables ref="tablesRef"/></el-tab-pane>
             <el-tab-pane label="SQL生成对象" name="codeGenerate"><code-generate ref="codeGenerateRef"/></el-tab-pane>
             <el-tab-pane label="字段不一致检测" name="columnCheck"><column-check ref="columnCheckRef"/></el-tab-pane>
             <el-tab-pane label="DDL入库" name="ddl">DDL入库-未完成</el-tab-pane>
             <el-tab-pane label="DML入库" name="dml">DML入库-未完成</el-tab-pane>
           </el-tabs>
         </el-col>
      </el-row>
   </div>
</template>

<script setup name="DatabaseManager">
import DatabaseSelect from '@/views/components/DatabaseSelect'
import Tables from './tables';
import ColumnCheck from './columnCheck';
import CodeGenerate from './codeGenerate';

const router = useRouter();
const { proxy } = getCurrentInstance();

const database = ref({});
const activeName = ref('codeGenerate');

function selectRow(row) {
  database.value = row;
  const refStr = activeName.value + 'Ref';
  proxy.$refs[refStr].setData(database.value);
}

function setTabsData(pane, event) {
  if (pane) {
    activeName.value = pane.props.name;
  }
  const refStr = activeName.value + 'Ref';
  proxy.$refs[refStr].setData(database.value);
}

</script>


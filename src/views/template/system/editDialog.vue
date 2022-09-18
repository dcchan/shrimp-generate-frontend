<template>
    <el-dialog v-model="open" :title="props.title" width="1200px" append-to-body>
        <el-form ref="editRef" :model="form" :rules="rules" label-width="100px">
            <el-row :gutter="20">
            <el-col :sm="24" :lg="12" style="padding-left: 20px">
                <el-form-item label="模板类型" prop="tempType">
                <el-select v-model="form.tempType" placeholder="模板类型" style="width: 200px">
                    <el-option v-for="item in TempType" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
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
            <code-editor v-model="form.tempContent" :config="{'theme': 'vs'}"></code-editor>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import TempType from '@/mock/dict/TempType';
import CodeEditor from './codeEditor';

const props = defineProps({
  open: Boolean,
  title: String,
  form: {
    tempType: String,
    tempName: String,
    tempSubfix: String,
    tempDesc: String,
    tempContent: String
  }
});

const { proxy } = getCurrentInstance();
const emit =  defineEmits(['submit']);

const open = ref(props.open);
const form = ref(props.form);
const rules = {
  tempType: [{ required: true, message: "模板类型不能为空", trigger: "blur" }],
  tempName: [{ required: true, message: "模板名称不能为空", trigger: "blur" }],
  tempSubfix: [{ required: true, message: "模板后缀不能为空", trigger: "blur" }],
  tempDesc: [{ required: true, message: "模板说明不能为空", trigger: "blur" }],
  tempContent: [{ required: true, message: "模板内容不能为空", trigger: "blur" }],
};

watchEffect(() => {
  open.value = props.open;
  form.value = props.form;
});

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

/** 提交按钮 */
function submitForm() {
  proxy.$refs["editRef"].validate(valid => {
    if (valid) {
      emit('submit', form.value, () => {
        open.value = false;
      });
    }
  });
}
</script>
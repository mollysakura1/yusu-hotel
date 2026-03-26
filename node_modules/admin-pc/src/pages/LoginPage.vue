<template>
  <div class="auth-shell" style="display: grid; place-items: center; padding: 40px 16px">
    <el-card style="width: 420px; border-radius: 24px">
      <template #header>
        <div>
          <div style="font-size: 28px; font-weight: 800; color: #102a43">易宿酒店后台</div>
          <div style="margin-top: 8px; color: #6b7a90">登录后根据账号自动识别商户或管理员角色</div>
        </div>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%; height: 44px" :loading="loading" @click="submit">登录</el-button>
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: space-between; color: #5b6b82; font-size: 14px">
        <span>演示账号：`merchant01 / 123456`、`admin01 / 123456`</span>
        <el-button link type="primary" @click="router.push('/register')">去注册</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const formRef = ref<FormInstance>();
const loading = ref(false);
const form = reactive({
  username: 'merchant01',
  password: '123456'
});

const rules: FormRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

const submit = async () => {
  await formRef.value?.validate();
  loading.value = true;
  try {
    await authStore.login(form);
    ElMessage.success('登录成功');
    router.push('/dashboard');
  } finally {
    loading.value = false;
  }
};
</script>

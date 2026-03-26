<template>
  <div class="auth-shell" style="display: grid; place-items: center; padding: 40px 16px">
    <el-card style="width: 460px; border-radius: 24px">
      <template #header>
        <div>
          <div style="font-size: 28px; font-weight: 800; color: #102a43">注册后台账号</div>
          <div style="margin-top: 8px; color: #6b7a90">支持商户与管理员两类账户，注册时选择角色</div>
        </div>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="form.role">
            <el-radio-button label="merchant">商户</el-radio-button>
            <el-radio-button label="admin">管理员</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%; height: 44px" :loading="loading" @click="submit">注册并登录</el-button>
        </el-form-item>
      </el-form>
      <el-button link type="primary" @click="router.push('/login')">已有账号，去登录</el-button>
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
  nickname: '',
  username: '',
  password: '',
  role: 'merchant' as 'merchant' | 'admin'
});

const rules: FormRules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
};

const submit = async () => {
  await formRef.value?.validate();
  loading.value = true;
  try {
    await authStore.register(form);
    ElMessage.success('注册成功');
    router.push('/dashboard');
  } finally {
    loading.value = false;
  }
};
</script>

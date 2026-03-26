<template>
  <div>
    <div style="margin-bottom: 16px">
      <div style="font-size: 18px; font-weight: 700; color: #102a43">用户管理</div>
      <div style="margin-top: 8px; color: #6b7a90">维护后台用户账号、角色与状态，用户权限自动继承自角色。</div>
    </div>

    <el-card style="margin-bottom: 16px; border-radius: 20px">
      <div style="display: flex; justify-content: space-between; gap: 16px; align-items: center">
        <div style="display: flex; gap: 12px">
          <el-input v-model="keyword" placeholder="请输入姓名或角色" style="width: 220px" clearable />
          <el-button type="primary" @click="loadUsers">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </div>
        <el-button type="primary" @click="openCreate">新增</el-button>
      </div>
    </el-card>

    <el-card style="border-radius: 20px">
      <el-table :data="users" border>
        <el-table-column prop="username" label="用户名" min-width="160" />
        <el-table-column prop="nickname" label="姓名" min-width="140" />
        <el-table-column label="角色" min-width="140">
          <template #default="{ row }">{{ roleNameMap[(row as User).role] }}</template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'enabled' ? 'success' : 'info'">
              {{ row.status === 'enabled' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="权限" min-width="260">
          <template #default="{ row }">
            <el-space wrap>
              <el-tag v-for="key in getPermissionKeys(row as User)" :key="key" type="info">{{ permissionLabels[key] }}</el-tag>
            </el-space>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="180" />
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewUser(row)">查看</el-button>
            <el-button link @click="editUser(row)">编辑</el-button>
            <el-button link type="danger" @click="removeUser(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑用户' : '新增用户'" width="520px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="用户名"><el-input v-model="form.username" :disabled="!!editingId" /></el-form-item>
        <el-form-item label="姓名"><el-input v-model="form.nickname" /></el-form-item>
        <el-form-item label="密码" v-if="!editingId"><el-input v-model="form.password" type="password" show-password /></el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="超级管理员" value="superAdmin" />
            <el-option label="管理员" value="admin" />
            <el-option label="商家" value="merchant" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="enabled" active-text="启用" inactive-text="停用" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="用户详情" width="560px">
      <div v-if="currentUser">
        <div style="font-size: 18px; font-weight: 700">{{ currentUser.nickname }}</div>
        <div style="margin-top: 12px; color: #425466">账号：{{ currentUser.username }}</div>
        <div style="margin-top: 12px; color: #425466">角色：{{ roleNameMap[currentUser.role] }}</div>
        <div style="margin-top: 12px">
          <el-space wrap>
            <el-tag v-for="key in getPermissionKeys(currentUser)" :key="key">{{ permissionLabels[key] }}</el-tag>
          </el-space>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { PERMISSION_LABELS } from '@shared/constants';
import type { PermissionKey, User, UserRole } from '@shared/types';
import { createSystemUser, deleteSystemUser, fetchRoles, fetchSystemUsers, updateSystemUser } from '@/api/hotel';

const keyword = ref('');
const users = ref<User[]>([]);
const roles = ref<any[]>([]);
const dialogVisible = ref(false);
const detailVisible = ref(false);
const editingId = ref('');
const currentUser = ref<User | null>(null);
const permissionLabels = PERMISSION_LABELS as Record<PermissionKey, string>;
const roleNameMap: Record<UserRole, string> = {
  superAdmin: '超级管理员',
  admin: '管理员',
  merchant: '商家'
};
const getPermissionKeys = (user: User | null) => (user?.permissionKeys || []) as PermissionKey[];

const form = reactive({
  username: '',
  nickname: '',
  password: '123456',
  role: 'admin' as UserRole,
  status: 'enabled' as 'enabled' | 'disabled'
});

const enabled = computed({
  get: () => form.status === 'enabled',
  set: (value: boolean) => {
    form.status = value ? 'enabled' : 'disabled';
  }
});

const loadUsers = async () => {
  users.value = await fetchSystemUsers({ keyword: keyword.value });
};

onMounted(async () => {
  roles.value = await fetchRoles();
  await loadUsers();
});

const resetFilter = async () => {
  keyword.value = '';
  await loadUsers();
};

const openCreate = () => {
  editingId.value = '';
  Object.assign(form, { username: '', nickname: '', password: '123456', role: 'admin', status: 'enabled' });
  dialogVisible.value = true;
};

const editUser = (row: User) => {
  editingId.value = row.id;
  Object.assign(form, { username: row.username, nickname: row.nickname, password: '', role: row.role, status: row.status });
  dialogVisible.value = true;
};

const viewUser = (row: User) => {
  currentUser.value = row;
  detailVisible.value = true;
};

const submit = async () => {
  const payload = { ...form };
  if (editingId.value) await updateSystemUser(editingId.value, payload);
  else await createSystemUser(payload);
  dialogVisible.value = false;
  ElMessage.success('用户信息已保存');
  await loadUsers();
};

const removeUser = async (id: string) => {
  await ElMessageBox.confirm('删除后该用户将无法继续登录，是否继续？', '删除用户', { type: 'warning' });
  await deleteSystemUser(id);
  ElMessage.success('用户已删除');
  await loadUsers();
};
</script>

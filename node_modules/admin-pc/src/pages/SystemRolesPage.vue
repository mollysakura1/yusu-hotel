<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px">
      <div>
        <div style="font-size: 18px; font-weight: 700; color: #102a43">角色管理</div>
        <div style="margin-top: 8px; color: #6b7a90">管理角色基础信息、权限点与菜单可见范围，用户权限自动随角色联动。</div>
      </div>
      <el-button type="primary" disabled>新增角色</el-button>
    </div>

    <el-row :gutter="16">
      <el-col v-for="role in roles" :key="role.id" :span="8">
        <el-card style="margin-bottom: 16px; border-radius: 20px; min-height: 250px">
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div style="font-size: 18px; font-weight: 700; color: #2b3a4b">{{ role.name }}</div>
            <el-tag>{{ role.code }}</el-tag>
          </div>
          <div style="margin-top: 16px; color: #6b7a90; min-height: 48px">{{ role.description }}</div>
          <div style="margin-top: 18px">
            <el-space wrap>
              <el-tag v-for="key in role.permissionKeys" :key="key" type="info">{{ permissionLabels[key] }}</el-tag>
            </el-space>
          </div>
          <div style="margin-top: 18px; display: flex; justify-content: flex-end; gap: 12px">
            <el-button link type="primary" @click="openPermissions(role)">权限管理</el-button>
            <el-button link @click="openMenus(role)">菜单管理</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="permissionVisible" title="角色权限管理" width="620px">
      <div v-if="currentRole">
        <div style="margin-bottom: 16px; color: #425466">角色：{{ currentRole.name }}</div>
        <el-checkbox-group v-model="editingPermissionKeys">
          <el-checkbox v-for="item in permissionOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <el-button @click="permissionVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRolePermissions">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="menuVisible" title="角色菜单管理" width="620px">
      <div v-if="currentRole">
        <div style="margin-bottom: 16px; color: #425466">角色：{{ currentRole.name }}</div>
        <el-checkbox-group v-model="editingMenuKeys">
          <el-checkbox v-for="item in menuOptions" :key="item.value" :value="item.value">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <el-button @click="menuVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRoleMenus">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { ADMIN_MENU_TREE, PERMISSION_LABELS } from '@shared/constants';
import type { PermissionKey, RolePermissionProfile } from '@shared/types';
import { fetchRoles, updateRole } from '@/api/hotel';

const roles = ref<RolePermissionProfile[]>([]);
const currentRole = ref<RolePermissionProfile | null>(null);
const permissionVisible = ref(false);
const menuVisible = ref(false);
const editingPermissionKeys = ref<PermissionKey[]>([]);
const editingMenuKeys = ref<string[]>([]);
const permissionLabels = PERMISSION_LABELS;

const permissionOptions = Object.entries(PERMISSION_LABELS).map(([value, label]) => ({ value, label }));
const menuOptions = ADMIN_MENU_TREE.flatMap((item) => (item.children?.length ? item.children : [item])).map((item) => ({
  value: item.key,
  label: item.label
}));

const loadRoles = async () => {
  roles.value = await fetchRoles();
};

onMounted(loadRoles);

const openPermissions = (role: RolePermissionProfile) => {
  currentRole.value = role;
  editingPermissionKeys.value = [...role.permissionKeys];
  permissionVisible.value = true;
};

const openMenus = (role: RolePermissionProfile) => {
  currentRole.value = role;
  editingMenuKeys.value = [...role.menuKeys];
  menuVisible.value = true;
};

const saveRolePermissions = async () => {
  if (!currentRole.value) return;
  await updateRole(currentRole.value.id, { permissionKeys: editingPermissionKeys.value });
  permissionVisible.value = false;
  ElMessage.success('角色权限已更新');
  await loadRoles();
};

const saveRoleMenus = async () => {
  if (!currentRole.value) return;
  await updateRole(currentRole.value.id, { menuKeys: editingMenuKeys.value });
  menuVisible.value = false;
  ElMessage.success('角色菜单已更新');
  await loadRoles();
};
</script>

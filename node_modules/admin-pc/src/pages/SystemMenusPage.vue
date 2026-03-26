<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px">
      <div>
        <div style="font-size: 18px; font-weight: 700; color: #102a43">菜单管理</div>
        <div style="margin-top: 8px; color: #6b7a90">查看后台菜单树，并展示各菜单关联的权限点。</div>
      </div>
      <el-button type="primary" disabled>分配菜单</el-button>
    </div>

    <el-card style="border-radius: 20px">
      <div style="display: flex; gap: 40px">
        <div style="width: 360px">
          <el-tree :data="treeData" node-key="key" default-expand-all :props="{ label: 'label', children: 'children' }" />
        </div>
        <div style="flex: 1">
          <div v-for="item in flatMenus" :key="item.key" style="display: flex; justify-content: space-between; margin-bottom: 16px">
            <div style="font-weight: 600; color: #425466">{{ item.label }}</div>
            <el-space wrap>
              <el-tag v-for="perm in menuPermissionMap[item.key] || []" :key="perm" type="success">
                {{ permissionLabels[perm] }}
              </el-tag>
            </el-space>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { PERMISSION_LABELS } from '@shared/constants';
import type { AdminMenuNode, PermissionKey } from '@shared/types';
import { fetchSystemMenus } from '@/api/hotel';

const treeData = ref<AdminMenuNode[]>([]);
const permissionLabels = PERMISSION_LABELS as Record<PermissionKey, string>;
const menuPermissionMap: Record<string, PermissionKey[]> = {
  dashboard: ['dashboard_view'],
  'hotel-edit': ['hotel_edit'],
  audit: ['audit_manage'],
  'system-users': ['user_manage'],
  'system-roles': ['role_manage'],
  'system-menus': ['menu_manage'],
  'system-logs': ['log_manage']
};

const flatMenus = computed(() =>
  treeData.value.flatMap((item) => (item.children?.length ? item.children : [item]))
);

onMounted(async () => {
  treeData.value = await fetchSystemMenus();
});
</script>

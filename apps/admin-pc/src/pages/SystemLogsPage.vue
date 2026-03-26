<template>
  <div>
    <div style="margin-bottom: 16px">
      <div style="font-size: 18px; font-weight: 700; color: #102a43">日志管理</div>
      <div style="margin-top: 8px; color: #6b7a90">记录系统关键操作行为，支持按关键词筛选查看。</div>
    </div>

    <el-card style="margin-bottom: 16px; border-radius: 20px">
      <div style="display: flex; gap: 12px">
        <el-input v-model="keyword" placeholder="请输入关键词" style="width: 220px" clearable />
        <el-button type="primary" @click="loadLogs">查询</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </div>
    </el-card>

    <el-card style="border-radius: 20px">
      <el-table :data="logs" border>
        <el-table-column prop="operatorName" label="操作人" min-width="140" />
        <el-table-column prop="module" label="模块" min-width="160" />
        <el-table-column prop="action" label="动作" min-width="120" />
        <el-table-column prop="ip" label="IP" min-width="140" />
        <el-table-column prop="createdAt" label="时间" min-width="180" />
        <el-table-column prop="detail" label="说明" min-width="260" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { SystemLog } from '@shared/types';
import { fetchSystemLogs } from '@/api/hotel';

const keyword = ref('');
const logs = ref<SystemLog[]>([]);

const loadLogs = async () => {
  logs.value = await fetchSystemLogs({ keyword: keyword.value });
};

const resetFilter = async () => {
  keyword.value = '';
  await loadLogs();
};

onMounted(loadLogs);
</script>

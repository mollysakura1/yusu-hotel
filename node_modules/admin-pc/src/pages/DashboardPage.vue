<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="8" v-for="card in cards" :key="card.title">
        <el-card>
          <div style="color: #6b7a90; font-size: 14px">{{ card.title }}</div>
          <div style="margin-top: 12px; font-size: 28px; font-weight: 800; color: #102a43">{{ card.value }}</div>
          <div style="margin-top: 8px; color: #1677ff; font-size: 13px">{{ card.desc }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-card style="margin-top: 16px">
      <template #header>
        <div style="font-weight: 700">运营提示</div>
      </template>
      <div style="line-height: 1.9; color: #425466">
        <div>1. 商户新增或修改酒店后会进入审核中状态，审核通过后前台用户端即可实时可见。</div>
        <div>2. 管理员可对酒店执行发布、下线、恢复，确保用户端只展示 approved 且非 offline 的酒店。</div>
        <div>3. 当前项目已预留优惠活动、套餐优惠、价格趋势、收藏、最近浏览等扩展能力。</div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const cards = computed(() =>
  authStore.role === 'merchant'
    ? [
        { title: '待提交酒店', value: '03', desc: '完善信息后可提交审核' },
        { title: '审核中酒店', value: '02', desc: '等待平台审核发布' },
        { title: '本周浏览增长', value: '+18%', desc: '高于上周同期' }
      ]
    : [
        { title: '待审核酒店', value: '06', desc: '需要尽快处理上线节奏' },
        { title: '已上线酒店', value: '21', desc: '可在用户端展示' },
        { title: '下线酒店', value: '03', desc: '支持后续恢复' }
      ]
);
</script>

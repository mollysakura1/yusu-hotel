<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-weight: 700">酒店审核 / 发布 / 下线管理</span>
          <div style="display: flex; gap: 12px">
            <el-input v-model="filters.keyword" placeholder="搜索酒店名/城市" style="width: 240px" clearable />
            <el-select v-model="filters.status" placeholder="状态筛选" clearable style="width: 160px">
              <el-option label="审核中" value="pending" />
              <el-option label="通过" value="approved" />
              <el-option label="不通过" value="rejected" />
              <el-option label="下线" value="offline" />
            </el-select>
            <el-button type="primary" @click="loadHotels">查询</el-button>
          </div>
        </div>
      </template>

      <el-table :data="hotels" border>
        <el-table-column prop="nameCn" label="酒店名" min-width="220" />
        <el-table-column prop="city" label="城市" width="100" />
        <el-table-column prop="merchantId" label="商户ID" width="140" />
        <el-table-column prop="priceStart" label="起售价" width="100" />
        <el-table-column prop="status" label="审核状态" width="120" />
        <el-table-column prop="rejectReason" label="驳回原因" min-width="180" />
        <el-table-column label="操作" min-width="280">
          <template #default="{ row }">
            <el-button link type="primary" @click="preview(row)">查看详情</el-button>
            <el-button link type="success" @click="doAudit(row, 'approved')">审核通过</el-button>
            <el-button link type="danger" @click="openReject(row)">不通过</el-button>
            <el-button link type="warning" @click="togglePublish(row)">
              {{ row.status === 'offline' ? '恢复上架' : '下线' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="detailVisible" title="酒店详情" width="720px">
      <div v-if="currentHotel">
        <div style="font-size: 20px; font-weight: 800">{{ currentHotel.nameCn }}</div>
        <div style="margin-top: 8px; color: #5b6b82">{{ currentHotel.address }}</div>
        <div style="margin-top: 12px">标签：{{ currentHotel.tags.join(' / ') }}</div>
        <div style="margin-top: 12px">房型数：{{ currentHotel.roomTypes.length }}</div>
      </div>
    </el-dialog>

    <el-dialog v-model="rejectVisible" title="填写不通过原因" width="420px">
      <el-input v-model="rejectReason" type="textarea" :rows="4" placeholder="请填写不通过原因" />
      <template #footer>
        <el-button @click="rejectVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmReject">确认驳回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { Hotel } from '@shared/types';
import { auditHotel, fetchAdminHotelDetail, fetchAuditHotels, toggleHotelPublish } from '@/api/hotel';

const hotels = ref<Hotel[]>([]);
const filters = reactive({ keyword: '', status: '' });
const detailVisible = ref(false);
const rejectVisible = ref(false);
const rejectReason = ref('');
const currentHotel = ref<Hotel | null>(null);

const loadHotels = async () => {
  hotels.value = await fetchAuditHotels(filters);
};

onMounted(loadHotels);

const preview = async (hotel: Hotel) => {
  currentHotel.value = await fetchAdminHotelDetail(hotel.id);
  detailVisible.value = true;
};

const doAudit = async (hotel: Hotel, status: 'approved' | 'rejected') => {
  await auditHotel(hotel.id, { status });
  ElMessage.success(status === 'approved' ? '已审核通过' : '已驳回');
  await loadHotels();
};

const openReject = (hotel: Hotel) => {
  currentHotel.value = hotel;
  rejectReason.value = '';
  rejectVisible.value = true;
};

const confirmReject = async () => {
  if (!currentHotel.value || !rejectReason.value.trim()) return;
  await auditHotel(currentHotel.value.id, { status: 'rejected', reason: rejectReason.value });
  rejectVisible.value = false;
  ElMessage.success('已记录驳回原因');
  await loadHotels();
};

const togglePublish = async (hotel: Hotel) => {
  await toggleHotelPublish(hotel.id, hotel.status === 'offline' ? 'restore' : 'offline');
  ElMessage.success(hotel.status === 'offline' ? '酒店已恢复上架' : '酒店已下线');
  await loadHotels();
};
</script>

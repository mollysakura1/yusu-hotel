<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-weight: 700">酒店信息录入 / 编辑</span>
          <el-tag type="warning">保存后进入审核中</el-tag>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="酒店名（中文）" prop="nameCn"><el-input v-model="form.nameCn" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="酒店名（英文）" prop="nameEn"><el-input v-model="form.nameEn" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="城市" prop="city"><el-input v-model="form.city" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="商圈" prop="businessArea"><el-input v-model="form.businessArea" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="酒店地址" prop="address"><el-input v-model="form.address" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="酒店星级" prop="star"><el-input-number v-model="form.star" :min="3" :max="5" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="起售价" prop="priceStart"><el-input-number v-model="form.priceStart" :min="100" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="开业时间" prop="openYear"><el-input-number v-model="form.openYear" :min="2000" :max="2030" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="标签"><el-select v-model="form.tags" multiple filterable style="width: 100%">
            <el-option v-for="item in tagOptions" :key="item" :value="item" :label="item" />
          </el-select></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="酒店图片"><el-input v-model="imageText" type="textarea" :rows="3" placeholder="一行一个图片地址" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="设施"><el-input v-model="facilityText" type="textarea" :rows="2" placeholder="使用中文逗号分隔，如：免费停车,健身房,亲子乐园" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="交通信息"><el-input v-model="trafficText" type="textarea" :rows="2" placeholder="一行一个" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="热门景点"><el-input v-model="spotText" type="textarea" :rows="2" placeholder="一行一个" /></el-form-item></el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="submit">保存酒店信息</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 16px">
      <template #header><span style="font-weight: 700">我的酒店列表</span></template>
      <el-table :data="hotels" border>
        <el-table-column prop="nameCn" label="酒店名" min-width="180" />
        <el-table-column prop="city" label="城市" width="100" />
        <el-table-column prop="priceStart" label="起售价" width="100" />
        <el-table-column prop="status" label="状态" width="110" />
        <el-table-column prop="updatedAt" label="更新时间" min-width="160" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="fillForm(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { HOTEL_TAG_OPTIONS } from '@shared/constants';
import type { Hotel } from '@shared/types';
import { createHotel, fetchMerchantHotels, updateHotel } from '@/api/hotel';

const formRef = ref<FormInstance>();
const saving = ref(false);
const hotels = ref<Hotel[]>([]);
const editingId = ref('');
const tagOptions = HOTEL_TAG_OPTIONS;

const form = reactive<any>({
  nameCn: '',
  nameEn: '',
  city: '上海',
  district: '浦东新区',
  address: '',
  businessArea: '',
  star: 4,
  priceStart: 499,
  openYear: 2021,
  tags: ['近地铁'],
  roomTypes: [],
  score: 4.7,
  reviewCount: 1280
});

const imageText = ref('');
const facilityText = ref('免费停车,健身房,行政酒廊');
const trafficText = ref('距地铁 2 号线步行 6 分钟');
const spotText = ref('陆家嘴中心\n世纪公园');

const rules: FormRules = {
  nameCn: [{ required: true, message: '请输入中文名', trigger: 'blur' }],
  nameEn: [{ required: true, message: '请输入英文名', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  city: [{ required: true, message: '请输入城市', trigger: 'blur' }]
};

const loadHotels = async () => {
  hotels.value = await fetchMerchantHotels();
};

onMounted(loadHotels);

const buildPayload = () => ({
  ...form,
  bannerImages: imageText.value.split('\n').filter(Boolean),
  coverImage: imageText.value.split('\n').filter(Boolean)[0] || '',
  trafficInfo: trafficText.value.split('\n').filter(Boolean),
  nearbySpots: spotText.value.split('\n').filter(Boolean),
  facilities: facilityText.value
    .split(/[，,]/)
    .filter(Boolean)
    .map((name, index) => ({ id: `facility-${index}`, name, group: 'basic' })),
  promotions: [{ id: 'promo-new', title: '限时优惠', tag: '促销', discountText: '连住 2 晚 9 折' }]
});

const submit = async () => {
  await formRef.value?.validate();
  saving.value = true;
  try {
    if (editingId.value) await updateHotel(editingId.value, buildPayload());
    else await createHotel(buildPayload());
    ElMessage.success('保存成功，酒店已进入审核中');
    editingId.value = '';
    await loadHotels();
  } finally {
    saving.value = false;
  }
};

const fillForm = (hotel: Hotel) => {
  editingId.value = hotel.id;
  Object.assign(form, hotel);
  imageText.value = hotel.bannerImages.join('\n');
  facilityText.value = hotel.facilities.map((item) => item.name).join(',');
  trafficText.value = hotel.trafficInfo.join('\n');
  spotText.value = hotel.nearbySpots.join('\n');
};
</script>

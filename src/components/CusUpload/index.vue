<template>
    <div class="rel">
        <img :src="url" class="img160 url" v-if="url" @click="previewImgs([url])">
        <img src="@/assets/otc/6.png" class="img160" v-else @click="uploadUrl">
        <img src="@/assets/otc/7.png" class="pic7 animate__animated animate__zoomIn" v-if="url" @click="url=''">
    </div>
</template>

<script setup lang="ts">
import { previewImgs } from '@/utils';
import { apiUpload } from '@/utils/request';

const url = defineModel<string>('url', { default: '' })

const uploadUrl = async () => {
    const res:any = await apiUpload()
    url.value = res.url
}
</script>

<style lang="scss" scoped>
.url{
    object-fit: cover;
    border-radius: 16px;
}
.pic7{
    width: 30px;
    height: 30px;
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 1;
}
</style>
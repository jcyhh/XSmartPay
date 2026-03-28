<template>
    <CusNav :title="$t('公告详情')"></CusNav>
    
    <div class="pl30 pr30 pt30 rel">

        <div class="size30 bold">{{ noticeDetail?.title }}</div>

        <div class="size24 gray mt20" v-init:time="noticeDetail?.updated_at"></div>

        <div class="mt40" v-html="noticeDetail?.content"></div>

    </div>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { useNotice } from '@/hooks/useNotice';

const { noticeDetail, loadNoticeDetail } = useNotice()
loadNoticeDetail()
</script>

<style lang="scss" scoped>

</style>
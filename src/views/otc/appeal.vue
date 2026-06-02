<template>
    <CusNav :title="$t('申诉')"></CusNav>

    <div class="pl30 pr30 pt30 rel">
        
        <div class="card">
            <textarea :placeholder="$t('请输入本次申请原因')" v-model="remark" maxlength="500" class="area"></textarea>
            <div class="size24 opc5 mt30">{{ remark.length }}/500 {{ $t('字') }}</div>
        </div>

        <div class="card mt30 flex jb ast">
            <div class="flex col jb">
                <div>
                    <div class="size28">{{ $t('申诉凭证') }}</div>
                    <div class="size24 opc5 mt10">{{ $t('请上传清晰的图片') }}</div>
                </div>
                <div class="size24 main">{{ $t('点击图片查看大图') }}</div>
            </div>
            <CusUpload v-model:url="appealVoucher"></CusUpload>
        </div>

    </div>

    <div class="safeArea"></div>
    <div class="gap130"></div>
    <div class="bottom">
        <div class="mainBtn size28 bold6 flex jc ac" @click="submit">{{ $t('提交') }}</div>
        <div class="safeArea"></div>
    </div>
</template>

<script setup lang="ts">
import { apiAppealOtcTrade } from '@/api/otc';
import CusUpload from '@/components/CusUpload/index.vue';
import { t } from '@/locale';
import { routerGo } from '@/router';
import { message } from '@/utils/message';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const { query } = useRoute()

const remark = ref('')
const appealVoucher = ref('')
const submitting = ref(false)

const submit = async () => {
    if(submitting.value)return
    if(!query.id)return message(t('订单不存在'))
    if(!remark.value.trim())return message(t('请输入本次申请原因'))

    submitting.value = true
    try {
        await apiAppealOtcTrade({
            id: query.id,
            appeal_reason: remark.value.trim(),
            appeal_voucher: appealVoucher.value
        })
        message(t('提交成功'), 'success')
        routerGo()
    } finally {
        submitting.value = false
    }
}
</script>

<style lang="scss" scoped>
.card{
    background-color: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    padding: 30px;
    border-radius: 20px;
    .area{
        width: 100%;
        height: 300px;
        background: transparent;
        border: none;
    }
}
.bottom{
    width: 100vw;
    padding: 20px 30px 30px 30px;
    background-color: #040404;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
}
</style>
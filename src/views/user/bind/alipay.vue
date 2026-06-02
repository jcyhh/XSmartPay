<template>
    <CusNav :title="$t('支付宝')"></CusNav>
    <div class="pl30 pr30 pt30 rel">
        
        <div class="cell flex ac">
            <input type="text" v-model="real_name" :placeholder="$t('真实姓名')" class="flex1 size28">
        </div>

        <div class="cell flex ac mt20">
            <input type="text" v-model="account" :placeholder="$t('支付宝账号')" class="flex1 size28">
        </div>

        <div class="cell upload flex jb ast mt20">
            <div class="flex col jb">
                <div>
                    <div class="size28">{{ $t('收款二维码') }}</div>
                    <div class="size24 opc5 mt10">{{ $t('请上传清晰的图片') }}</div>
                </div>
                <div class="size24 main">{{ $t('点击图片查看大图') }}</div>
            </div>
            <CusUpload v-model:url="qr_code"></CusUpload>
        </div>

        <div class="mainBtn mt60 flex jc ac size28 bold5" @click="submit">{{ $t('确认') }}</div>

    </div>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { apiOtcPaymentDetail, apiSaveOtcPayment } from '@/api/otc';
import { t } from '@/locale';
import { routerGo } from '@/router';
import { message } from '@/utils/message';
import { onMounted, ref } from 'vue';
import CusUpload from '@/components/CusUpload/index.vue'

interface AlipayPayment {
    id?: number | null
    real_name?: string | null
    account?: string | null
    qr_code?: string | null
}

const real_name = ref()
const account = ref()
const qr_code = ref()

const loadDetail = async () => {
    const res = await apiOtcPaymentDetail({ type: 'alipay' }) as unknown as AlipayPayment
    if (!res?.id) return

    real_name.value = res.real_name || ''
    account.value = res.account || ''
    qr_code.value = res.qr_code || ''
}

const submit = async () => {
    if(!real_name.value)return message(t('请输入真实姓名'))
    if(!account.value)return message(t('请输入支付宝账号'))
    if(!qr_code.value)return message(t('请上传收款二维码'))

    await apiSaveOtcPayment({
        type: 'alipay',
        real_name: real_name.value,
        account: account.value,
        qr_code: qr_code.value
    })

    message(t('保存成功'), 'success')
    setTimeout(() => routerGo(), 1200)
}

onMounted(() => {
    loadDetail()
})
</script>

<style lang="scss" scoped>
.cell{
    background: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    padding: 0 30px;
    min-height: 88px;
    border-radius: 14px;
}
.upload{
    padding: 30px;
}
</style>
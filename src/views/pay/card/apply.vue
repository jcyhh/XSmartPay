<template>
    <CusNav :title="$t('申请实体卡')">
        <div class="tr size26" @click="routerPush('/physical/record')">{{ $t('申请记录') }}</div>
    </CusNav>
    <div class="pl30 pr30 pt30 rel">
        
        <div class="size28 bold6">{{ $t('收件人姓名') }}</div>
        <div class="cell card mb20 flex jb ac mt20">
            <input type="text" v-model="recipient_name" :placeholder="$t('请输入收件人姓名')" class="flex1 size28">
        </div>

        <div class="size28 bold6 mt30">{{ $t('收件地址') }}</div>
        <div class="cell card mb20 flex jb ac mt20">
            <input type="text" v-model="recipient_address" :placeholder="$t('请输入收件地址')" class="flex1 size28">
        </div>

        <div class="size28 bold6 mt30">{{ $t('收件电话') }}</div>
        <div class="cell card mb20 flex jb ac mt20">
            <input type="text" v-model="recipient_phone" :placeholder="$t('请输入收件电话')" class="flex1 size28">
        </div>

    </div>

    <div class="safeArea"></div>
    <div class="gap130"></div>
    <div class="bottom">
        <div class="mainBtn size28 bold6 flex jc ac" @click="openAsk">{{ $t('确认') }}</div>
        <div class="safeArea"></div>
    </div>

    <CusAsk v-model:show="show" :title="$t('申请实体卡')" @submit="submit">{{ $t('支付 199$ 申请') }}</CusAsk>
</template>

<script setup lang="ts">
import { apiCardApply } from '@/api/card';
import CusNav from '@/components/CusNav/index.vue'
import { t } from '@/locale';
import { routerPush, routerReplace } from '@/router';
import { message } from '@/utils/message';
import { ref } from 'vue';
import CusAsk from '@/components/CusAsk/index.vue'

const show = ref(false)

const recipient_name = ref()
const recipient_address = ref()
const recipient_phone = ref()

const openAsk = () => {
    if(!recipient_name.value)return message(t('请输入收件人姓名'))
    if(!recipient_address.value)return message(t('请输入收件地址'))
    if(!recipient_phone.value)return message(t('请输入收件电话'))
    show.value = true
}

const submit = async () => {
    await apiCardApply({
        recipient_name: recipient_name.value,
        recipient_address: recipient_address.value,
        recipient_phone: recipient_phone.value
    })
    message(t('提交成功'), 'success')
    setTimeout(() => {
        routerReplace('/physical/record')
    }, 1200);
}
</script>

<style lang="scss" scoped>
.card{
    border-radius: 20px;
    padding: 30px;
    &::before{
        border-radius: 20px;
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
.btn{
    flex: 1;
    height: 68px;
    border-radius: 34px;
}
</style>
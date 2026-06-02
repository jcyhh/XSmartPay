<template>
    <CusNav :title="$t('设置')" :show-bg="false"></CusNav>
    <div class="pl30 pr30 pt30">
        
        <div class="cell card flex jb ac mb20" @click="routerPush('/edit')" v-if="!isH5">
            <div class="size28">{{ $t('修改密码') }}</div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div>

        <div class="cell card flex jb ac" @click="routerPush('/editPay')">
            <div class="size28">{{ $t('修改支付密码') }}</div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div>

        <div class="cell card flex jb ac mt20" @click="routerPush('/user/bind/bank')">
            <div class="size28">{{ $t('银行卡') }}</div>
            <div class="flex ac">
                <div class="bind binded flex ac animate__animated animate__zoomIn ani3" v-if="isPaymentBinded('bank_card')">{{ $t('已绑定') }}</div>
                <div class="bind unbind flex ac animate__animated animate__zoomIn ani3" v-else>{{ $t('未绑定') }}</div>
                <van-icon name="arrow" color="#FFFFFF80" />
            </div>
        </div>

        <div class="cell card flex jb ac mt20" @click="routerPush('/user/bind/alipay')">
            <div class="size28">{{ $t('支付宝') }}</div>
            <div class="flex ac">
                <div class="bind binded flex ac animate__animated animate__zoomIn ani3" v-if="isPaymentBinded('alipay')">{{ $t('已绑定') }}</div>
                <div class="bind unbind flex ac animate__animated animate__zoomIn ani3" v-else>{{ $t('未绑定') }}</div>
                <van-icon name="arrow" color="#FFFFFF80" />
            </div>
        </div>

        <div class="cell card flex jb ac mt20" @click="routerPush('/user/bind/wechat')">
            <div class="size28">{{ $t('微信') }}</div>
            <div class="flex ac">
                <div class="bind binded flex ac animate__animated animate__zoomIn ani3" v-if="isPaymentBinded('wechat')">{{ $t('已绑定') }}</div>
                <div class="bind unbind flex ac animate__animated animate__zoomIn ani3" v-else>{{ $t('未绑定') }}</div>
                <van-icon name="arrow" color="#FFFFFF80" />
            </div>
        </div>

        <div class="cell card flex jb ac mt20" @click="routerPush('/helps')">
            <div class="size28">{{ $t('帮助中心') }}</div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div>

        <div class="cell card flex jb ac mt20" @click="routerPush('/account')" v-if="!isH5">
            <div class="size28">{{ $t('切换账号') }}</div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div>

        <div class="mainButton mainButtonDel flex jc ac main btn flex1 mt100" v-scale @click="show=true" v-if="!isH5">{{ $t('退出登录') }}</div>

    </div>

    <CusAsk v-model:show="show" @submit="logout">{{ $t('确定要退出登录吗？') }}</CusAsk>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { delAccount, delToken, getAccount, removeAccountItem } from '@/config/storage';
import { routerPush, routerReplace } from '@/router';
import { useAppStore } from '@/store';
import { storeToRefs } from 'pinia';
import CusAsk from '@/components/CusAsk/index.vue'
import { onActivated, onMounted, ref } from 'vue';
import { apiOtcPaymentDetail } from '@/api/otc';

interface PaymentItem {
    id?: number
    type: string
}

const appStore = useAppStore()
const { isH5 } = storeToRefs(appStore)

const show = ref(false)
const bindedPayTypes = ref<string[]>([])
const payTypes = ['bank_card', 'alipay', 'wechat']

const loadPaymentStatus = async () => {
    const results = await Promise.allSettled(
        payTypes.map(type => apiOtcPaymentDetail({ type }))
    )

    bindedPayTypes.value = results.reduce<string[]>((types, result, index) => {
        if (result.status === 'fulfilled') {
            const payment = result.value as unknown as PaymentItem
            if (payment?.id) types.push(payTypes[index])
        }
        return types
    }, [])
}

const isPaymentBinded = (type:string) => bindedPayTypes.value.includes(type)

const logout = () => {
    const email = getAccount()
    if (email) {
        removeAccountItem(email)
    }
    delToken()
    delAccount()
    routerReplace(isH5.value ? '/' : '/login')
}

onMounted(() => {
    loadPaymentStatus()
})

onActivated(() => {
    loadPaymentStatus()
})
</script>

<style lang="scss" scoped>
.card{
    padding: 30px;
}
.btn{
    height: 88px;
    border-radius: 44px;
}
.bind{
    height: 44px;
    border-radius: 22px;
    padding: 0 10px;
    font-size: 20px;
    margin-right: 10px;
}
.unbind{
    background-color: #E2323233;
    color: #E23232;
}
.binded{
    background-color: #2CA23033;
    color: #2CA230;
}
</style>
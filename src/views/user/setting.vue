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
            <div class="size28">银行卡</div>
            <div class="flex ac">
                <div class="bind unbind flex ac">未绑定</div>
                <div class="bind binded flex ac">已绑定</div>
                <van-icon name="arrow" color="#FFFFFF80" />
            </div>
        </div>

        <div class="cell card flex jb ac mt20" @click="routerPush('/user/bind/alipay')">
            <div class="size28">支付宝</div>
            <div class="flex ac">
                <div class="bind unbind flex ac">未绑定</div>
                <div class="bind binded flex ac">已绑定</div>
                <van-icon name="arrow" color="#FFFFFF80" />
            </div>
        </div>

        <div class="cell card flex jb ac mt20" @click="routerPush('/user/bind/wechat')">
            <div class="size28">微信</div>
            <div class="flex ac">
                <div class="bind unbind flex ac">未绑定</div>
                <div class="bind binded flex ac">已绑定</div>
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
import { ref } from 'vue';

const appStore = useAppStore()
const { isH5 } = storeToRefs(appStore)

const show = ref(false)

const logout = () => {
    const email = getAccount()
    if (email) {
        removeAccountItem(email)
    }
    delToken()
    delAccount()
    routerReplace(isH5.value ? '/' : '/login')
}
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
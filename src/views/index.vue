<template>
    <img src="@/assets/start/1.png" class="pic1" />
    <img src="@/assets/start/2.png" class="pic2 animate__animated animate__zoomIn delay3">
    <div class="grey size20 tips animate__animated animate__slideInUp delay3 flex jc ac">
        <span class="mr10">Welcome to X SmartPay</span>
        <van-loading :size="20"></van-loading>
    </div>
</template>

<script setup lang="ts">
import { apiDappLogin } from '@/api/login';
import { getRef, getToken, setRef, setToken } from '@/config/storage';
import { getSign } from '@/dapp';
import { routerReplace } from '@/router';
import { useAppStore, useDappStore } from '@/store';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const appStore = useAppStore()
const { isH5 } = storeToRefs(appStore)

const dappStore = useDappStore()
const { providerStatus, walletAddress } = storeToRefs(dappStore)

const { params } = useRoute()
if(params?.ref)setRef(params?.ref as any)

const homePath = '/home'

const token = getToken()

if(!isH5.value){
    // webview环境
    setTimeout(() => {
        if(params?.ref){
            routerReplace('/register')
        }else{
            if(token)routerReplace(homePath)
            else routerReplace('/login')
        }
    }, 1200);
}

// 登录
const dappLoginIn = async () => {
    const signInfo = await getSign('Login')
    const res:any = await apiDappLogin({
        ref: getRef(),
        address: walletAddress.value,
        ...signInfo
    })
    setToken(res.token)
    routerReplace(homePath)
}

watch(providerStatus, status => {
    if(!isH5.value)return;
    if(status==1){
        // 有钱包环境
        setTimeout(() => {
            token ? routerReplace(homePath) : dappLoginIn()
        }, 1200)
    }else if(status==2){
        // 无钱包环境
        setTimeout(() => {
            if(token)routerReplace(homePath)
            else routerReplace('/login')
        }, 1200);
    }
}, {immediate: true})
</script>

<style lang="scss" scoped>
.pic1{
    width: 100vw;
    height: 850px;
    position: fixed;
    bottom: 170px;
    left: 0;
    transform-origin: bottom center;
    animation: scale-in 1.2s linear forwards;
}

@keyframes scale-in {
    from {
        transform: scale(1.5);
    }
    to {
        transform: scale(1);
    }
}
.pic2{
    width: 224px;
    height: 211px;
    position: fixed;
    bottom: 953px;
    left: 263px;
}
.tips{
    position: fixed;
    bottom: 30px;
    width: 100vw;
    text-align: center;
}
</style>
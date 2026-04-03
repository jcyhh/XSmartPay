<template>
    <RouterView v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" />
    </RouterView>

    <CusLoading v-model="dappLoading"></CusLoading>

    <img
        ref="kefu"
        src="@/assets/kefu.png"
        class="kefu"
        :style="kefuStyle"
        @click="openLink(kf_url)"
        @touchstart="onKefuTouchStart"
        @touchmove="onKefuTouchMove"
        @touchend="onKefuTouchEnd"
    >
</template>

<script setup lang="ts">
import CusLoading from '@/components/CusLoading/index.vue'
import { storeToRefs } from 'pinia';
import { useAppStore, useDappStore } from './store';
import { delToken } from './config/storage';
import { routerReplace } from './router';
import { checkChain, getConnectedAddress } from './dapp';
import detectEthereumProvider from '@metamask/detect-provider';
import { computed, onMounted, ref } from 'vue';
import { apiConfig } from './api/home';
import { openLink } from './utils';

const dappStore = useDappStore()
const { dappLoading } = storeToRefs(dappStore)

const appStore = useAppStore()
const { isH5 } = storeToRefs(appStore)

let ethereum:any = null
const kefu = ref<HTMLImageElement>()
const getDefaultKefuPosition = () => {
    if (typeof window === 'undefined') {
        return { left: 0, top: 0 }
    }
    return {
        left: Math.max(window.innerWidth - 80, 0),
        top: Math.max(window.innerHeight - 80, 0)
    }
}

const defaultKefuPosition = getDefaultKefuPosition()
const kefuLeft = ref(defaultKefuPosition.left)
const kefuTop = ref(defaultKefuPosition.top)
const kefuDragging = ref(false)
const kefuReady = ref(false)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)

const kf_url = ref()
const loadData = async () => {
    const res:any = await apiConfig()
    kf_url.value = res.kf_url
}
loadData()

const getKefuMaxPosition = () => {
    const width = kefu.value?.offsetWidth || 100
    const height = kefu.value?.offsetHeight || 100
    return {
        maxLeft: Math.max(window.innerWidth - width, 0),
        maxTop: Math.max(window.innerHeight - height, 0)
    }
}

const clampKefuPosition = (left: number, top: number) => {
    const { maxLeft, maxTop } = getKefuMaxPosition()
    return {
        left: Math.min(Math.max(left, 0), maxLeft),
        top: Math.min(Math.max(top, 0), maxTop)
    }
}

const kefuStyle = computed(() => ({
    left: `${kefuLeft.value}px`,
    top: `${kefuTop.value}px`,
    transition: !kefuReady.value || kefuDragging.value ? 'none' : 'left 0.3s ease, top 0.3s ease'
}))

const onKefuTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0]
    if (!touch) return
    kefuDragging.value = true
    dragOffsetX.value = touch.clientX - kefuLeft.value
    dragOffsetY.value = touch.clientY - kefuTop.value
}

const onKefuTouchMove = (event: TouchEvent) => {
    const touch = event.touches[0]
    if (!touch) return
    const position = clampKefuPosition(
        touch.clientX - dragOffsetX.value,
        touch.clientY - dragOffsetY.value
    )
    kefuLeft.value = position.left
    kefuTop.value = position.top
}

const onKefuTouchEnd = () => {
    kefuDragging.value = false
}

// 检测钱包环境
const detectProvider = async () => {
    dappStore.providerStatus = 0
    const _ethereum = (window as any).ethereum
    if(_ethereum){
        dappStore.providerStatus = 1
        ethereum = _ethereum
        return;
    }
    const provider = await detectEthereumProvider({
        mustBeMetaMask: false,
        silent: true,
        timeout: 6000
    })
    if(provider){
        dappStore.providerStatus = 1
        ethereum = provider
        return;
    }
    dappStore.providerStatus = 2
}

// 回调：账户切换、断开钱包链接、网络切换
const handlerChanged = async () => {
    delToken()
    dappStore.walletAddress = ''
    removeListener();
    routerReplace('/')
    await init();
}

// 创建监听
const createListener = () => {
    ethereum.on('accountsChanged', handlerChanged); // 账户切换或断开钱包链接
    ethereum.on('chainChanged',  handlerChanged); // 网络切换
}
// 移除监听
const removeListener = () => {
    ethereum.off('accountsChanged', handlerChanged);
    ethereum.off('chainChanged',  handlerChanged);
}

const init = async () => {
    await detectProvider()
    if(!ethereum)return
    dappStore.walletAddress = await getConnectedAddress()
    await checkChain() // 检查网络
    createListener() // 创建监听
}

onMounted(() => {
    const position = clampKefuPosition(window.innerWidth - 80, window.innerHeight - 80)
    kefuLeft.value = position.left
    kefuTop.value = position.top
    kefuReady.value = true
})

if(isH5.value)init()
</script>

<style scoped>
.kefu{
	width: 100px;
	height: 100px;
	position: fixed;
	z-index: 9999;
	touch-action: none;
	user-select: none;
}
</style>

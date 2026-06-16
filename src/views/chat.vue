<template>
    <div class="chatPage">
        <iframe :src="url" class="chat" @load="isLoading=false" v-if="url"></iframe>
        <div class="load flex col jc ac" v-if="isLoading">
            <CusEmpty></CusEmpty>
            <van-loading>{{ $t('链接中...') }}</van-loading>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getAddress, getLang, getToken } from '@/config/storage';
import { routerGo } from '@/router';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import CusEmpty from '@/components/CusEmpty/index.vue'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const isLoading = ref(true)

const url = computed(()=>{
    if (!userInfo.value?.id) return ''

    const searchParams = new URLSearchParams({
        token: getToken(),
        address: getAddress(),
        userId: String(userInfo.value.id),
        lang: getLang()
    })

    // return `${import.meta.env.PROD ? window.origin : 'https://www.xsmartpay.com'}/chat/#/?${searchParams.toString()}`
    return `${import.meta.env.PROD ? window.origin : 'http://localhost:8080'}/#/?${searchParams.toString()}`
})

const onMessage = (e:any) => {
  	if(e.data?.type === "back"){
        routerGo()
    }
}

onMounted(()=>{
    if (!userInfo.value?.id) userStore.loadUserInfo()
    window.addEventListener("message", onMessage)
})

onUnmounted(()=>{
    window.removeEventListener("message", onMessage)
})
</script>

<style lang="scss" scoped>
.chatPage{
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    position: fixed;
    inset: 0;
    z-index: 1000;
    overflow: hidden;
}
.chat{
    display: block;
    width: 100%;
    height: 100%;
    border: none;
}
.load{
    position: absolute;
    inset: 0;
    z-index: 10;
}
</style>
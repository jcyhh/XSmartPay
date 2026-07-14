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
import { useAppStore, useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import CusEmpty from '@/components/CusEmpty/index.vue'
import { apiUpload } from '@/utils/request';

const userStore = useUserStore()
const appStore = useAppStore()
const { userInfo } = storeToRefs(userStore)
const { isH5 } = storeToRefs(appStore)

const isLoading = ref(true)
let isUploading = false

const uploadRequestType = 'xsmartpay:uploadImage'
const uploadResultType = 'xsmartpay:uploadImageResult'

const url = computed(()=>{
    if (!userInfo.value?.id) return ''

    const searchParams = new URLSearchParams({
        token: getToken(),
        address: getAddress(),
        userId: String(userInfo.value.id),
        lang: getLang(),
        isFlutter: isH5.value ? '0' : '1'
    })
    const link = `${window.origin}/chat/#/?${searchParams.toString()}`
    return link;
})

const postUploadResult = (e: MessageEvent, data: Record<string, any>) => {
    const source = e.source as Window | null
    if (!source) return

    source.postMessage({
        type: uploadResultType,
        requestId: e.data?.requestId,
        ...data
    }, e.origin && e.origin !== 'null' ? e.origin : '*')
}

const onUploadMessage = async (e: MessageEvent) => {
    if (isUploading) {
        postUploadResult(e, {
            success: false,
            message: 'uploading'
        })
        return
    }

    isUploading = true

    try {
        const res = await apiUpload()
        postUploadResult(e, {
            success: true,
            data: res
        })
    } catch (err: any) {
        postUploadResult(e, {
            success: false,
            message: err?.message || 'upload failed'
        })
    } finally {
        isUploading = false
    }
}

const onMessage = (e: MessageEvent) => {
    if(e.data?.type === "back"){
        routerGo()
        return
    }

    if (e.data?.type === uploadRequestType) {
        void onUploadMessage(e)
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

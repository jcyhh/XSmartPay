<template>
    <div class="cusnav flex ac" :class="showGlass?'glass':'defBg'">
        <img src="@/assets/login/bg.webp" class="cusnavbg animate__animated animate__slideInDown" v-if="showBg">
        <div class="flex1 rel" @click="routerGo()">
            <van-icon name="arrow-left" :size="25" />
        </div>
        <div class="flex3 size32 bold5 tc rel">{{ title }}</div>
        <div class="flex1 rel">
            <slot></slot>
        </div>
    </div>
    <img src="@/assets/login/bg.webp" class="pagebg animate__animated animate__slideInDown" v-if="showBg">
    <div class="gap100"></div>
</template>

<script setup lang="ts">
import { routerGo } from '@/router';

defineProps({
    title:{
        type: String,
        default: ''
    },
    showBg:{
        type: Boolean,
        default: true
    },
    showGlass:{
        type: Boolean,
        default: true
    }
})
</script>

<style lang="scss" scoped>
.cusnav{
    height: 100px;
    width: 100vw;
    padding: 0 30px;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    .cusnavbg{
        width: 100vw;
        height: auto;
        position: absolute;
        top: 0;
        left: 0;
    }
}
.defBg{
    background-color: #0B0B0B;
}
.glass{
    background-color: #FFFFFF0A;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
}
.pagebg{
    width: 100vw;
    height: auto;
    position: fixed;
    top: 0;
    left: 0;
}
</style>

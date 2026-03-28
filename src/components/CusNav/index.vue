<template>
    <div class="cusnav flex ac">
        <img src="@/assets/login/bg.png" class="cusnavbg animate__animated animate__slideInDown">
        <div class="flex1 rel" @click="routerGo()">
            <van-icon name="arrow-left" :size="25" />
        </div>
        <div class="flex3 size32 bold5 tc rel">{{ title }}</div>
        <div class="flex1 rel">
            <slot></slot>
        </div>
    </div>
    <img src="@/assets/login/bg.png" class="pagebg animate__animated animate__slideInDown">
    <div class="gap100"></div>
</template>

<script setup lang="ts">
import { routerGo } from '@/router';

defineProps(['title'])
</script>

<style lang="scss" scoped>
.cusnav{
    height: 100px;
    width: 100vw;
    background-color: #000000;
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
.pagebg{
    width: 100vw;
    height: auto;
    position: fixed;
    top: 0;
    left: 0;
}
</style>
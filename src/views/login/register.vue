<template>
    <img src="@/assets/common/lang.png" class="lang" @click="show=true">

    <div class="gap200 mb50"></div>

    <img src="@/assets/login/bg.png" class="bg animate__animated animate__slideInDown">

    <div class="pl30 pr30 rel">

        <div class="size52 bold main mb60">{{ $t('注册') }}</div>

        <Register type="1"></Register>

    </div>

    <CusLang v-model:show="show"></CusLang>
</template>

<script setup lang="ts">
import CusLang from '@/components/CusLang/index.vue'
import { ref } from 'vue';
import Register from './components/Register.vue';

const show = ref(false)
</script>

<style lang="scss" scoped>
.lang{
    width: 52px;
    height: 52px;
    position: fixed;
    top: 30px;
    right: 30px;
    z-index: 10;
}
.bg{
    width: 100vw;
    height: 1334px;
    position: fixed;
    top: 0;
    left: 0;
}
.tab{
    height: 140px;
    .tabItem{
        height: 140px;
        padding: 40px 60px 0 0;
        position: relative;
        .tabLine{
            width: 30%;
            height: 4px;
            border-radius: 2px;
            background-color: $main-color;
        }
    }
}
</style>
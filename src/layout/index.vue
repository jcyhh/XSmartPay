<template>
    <div class="head flex jb ac">
        <div class="flex ac">
            <img src="@/assets/tabbar/logo.png" class="logo">
            <div class="size24 bold ml10">{{ appName }}</div>
        </div>
        <div class="flex ac">
            <div class="flex ac level mr20">
                <img src="@/assets/tabbar/level.png" class="img44 mr8">
                <div class="linearTxt size20 bold">理事会</div>
            </div>
            <img src="@/assets/common/lang.png" class="img52" @click="show=true">
        </div>
    </div>
    <div class="gap100"></div>

    <div class="content">
        <RouterView></RouterView>
    </div>

    <Tabbar></Tabbar>

    <CusLang v-model:show="show"></CusLang>
</template>

<script setup lang="ts">
import CusLang from '@/components/CusLang/index.vue';
import { ref } from 'vue';
import Tabbar from './Tabbar.vue';
import { appName } from '@/config';

const show = ref(false)
</script>

<style lang="scss" scoped>
.head {
    width: 100vw;
    height: 100px;
    background-color: #FFFFFF0A;
    z-index: 10;
    padding: 0 30px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    .logo{
        width: 40px;
        height: 30px;
    }

    .level{
        height: 52px;
        border-radius: 26px;
        padding: 0 12px;
        background-color: #F6F6F61A;
        position: relative;
        &::before{
            content: '';
            position: absolute;
            z-index: -1;
            top: -1px;
            left: -1px;
            right: -1px;
            bottom: -1px;
            border-radius: 26px;
            background: linear-gradient(#666666, #F0CC7F);
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: xor;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            padding: 1px;
        }
    }
}

.pop {
    width: 520px;
    height: 100vh;
    padding-top: 100px;

    .menu {
        width: 520px;
        height: calc(100vh - 100px);
        padding: 40px 30px;
        background-color: #191B1A;
        position: relative;
        .item{
            height: 76px;
            border-radius: 38px;
            padding: 0 30px;
            margin-bottom: 25px;
        }
        .border{
            width: 460px;
            height: 76px;
            position: absolute;
        }
    }
}
</style>
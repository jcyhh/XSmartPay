<template>
    <img src="@/assets/start/1.png" class="pic1" />
    <img src="@/assets/start/2.png" class="pic2 animate__animated animate__zoomIn delay3">
    <div class="grey size20 tips animate__animated animate__slideInUp delay3">Welcome to X SmartPay</div>
</template>

<script setup lang="ts">
import { getToken, setRef } from '@/config/storage';
import { routerReplace } from '@/router';
import { useRoute } from 'vue-router';

const { params } = useRoute()
if(params?.ref)setRef(params?.ref as any)

const token = getToken()
setTimeout(() => {
    if(token)routerReplace('/home')
    else routerReplace('/login')
}, 1200);
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
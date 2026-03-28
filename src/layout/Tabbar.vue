<template>
    <!-- <div class="tabbar flex jb ac">
        <div class="flex1 flex ac col size24" v-for="(item,index) in tabbar" :key="index" @click="tabbarClick(item.path)">
            <img :src="$route.path==item.path?item.actIcon:item.icon" class="img60">
            <div :class="$route.path==item.path?'':'grey'">{{ item.name }}</div>
        </div>
    </div> -->
</template>

<script setup lang="ts">
// import { computed } from 'vue';
// import homeIcon from '@/assets/common/home.png'
// import homeActIcon from '@/assets/common/homeHL.png'
// import fomocIcon from '@/assets/common/fomoc.png'
// import fomocActIcon from '@/assets/common/fomocHL.png'
// import equityIcon from '@/assets/common/equity.png'
// import equityActIcon from '@/assets/common/equityHL.png'
// import { routerReplace } from '@/router';
// import { t } from '@/locale';
// import { openLink } from '@/utils';

// const tabbar = computed(()=>([
//     {name:t('首页'),path:'/home/index',icon:homeIcon, actIcon:homeActIcon},
//     // {name:t('FOMO池'),path:'/fomoc/index',icon:fomocIcon, actIcon:fomocActIcon},
//     {name:t('备用'),path:'',icon:fomocIcon, actIcon:fomocActIcon},
//     {name:t('权益'),path:'/equity/index',icon:equityIcon, actIcon:equityActIcon}
// ]))

// const tabbarClick = (path:string) => {
//     if(path)routerReplace(path)
//     else openLink('https://ai.laxai.top')
// }
</script>

<style lang="scss" scoped>
.tabbar{
    flex-shrink: 0;
    width: 100%;
    height: 100px;
    background-image: url("@/assets/common/tabbar.png");
    background-size: 100% 100%;
    z-index: 10;
    padding: 0 40px;
}
</style>
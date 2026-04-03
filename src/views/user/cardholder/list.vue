<template>
    <CusNav :title="$t('持卡人管理')"></CusNav>
    <div class="pl30 pr30 pt30 rel">
        
        <div class="cell card mb20" v-for="(item,index) in list" :key="index">
            <div class="flex ac">
                <img src="@/assets/user/1.png" class="img100 avatar">
                <div class="flex1">
                    <div class="flex jb ac">
                        <div class="size28 bold6 main">{{ item.first_name }} {{ item.last_name }}</div>
                        <div class="size24 bold6" v-init:phone="item.phone"></div>
                    </div>
                    <div class="flex jb ac mt10">
                        <div class="size24 opc5">{{ item.country }}({{ item.country_code }})</div>
                        <div class="mainButton btn flex ac main" @click="routerPush(`/cardholder/${item.id}`)">{{ $t('查看详情') }}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="safeArea"></div>
    <div class="gap130"></div>
    <div class="bottom">
        <div class="mainBtn size28 bold6 flex jc ac" @click="routerPush('/cardholder/add')">{{ $t('添加持卡人') }}</div>
        <div class="safeArea"></div>
    </div>

    <Create v-model:show="show"></Create>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import Create from '../components/Create.vue';
import { onMounted, ref } from 'vue';
import { routerPush } from '@/router';
import { apiCardholder } from '@/api/user';

const show = ref(false)

const list = ref<any[]>([])
const loadList = async () => {
    const res:any = await apiCardholder({
        page_no: 1,
        page_size: 20
    })
    list.value = res.cardholders
}

onMounted(()=>{
    loadList()
})
</script>

<style lang="scss" scoped>
.card{
    padding: 24px 24px 20px 24px;
    border-radius: 20px;
    &::before{
        border-radius: 20px;
    }
    .avatar{
        border-radius: 16px;
        margin-right: 20px;
    }
    .line{
        width: 100%;
        height: 1px;
        background-color: #FFFFFF33;
    }
    .desc{
        width: 300px;
    }
    .btn{
        height: 48px;
        padding: 0 20px;
        border-radius: 24px;
        font-size: 28px;
        font-weight: 600;
    }
}
.bottom{
    width: 100vw;
    padding: 20px 30px 30px 30px;
    background-color: #040404;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
}
</style>
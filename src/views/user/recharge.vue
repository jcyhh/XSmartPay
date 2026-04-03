<template>
    <CusNav :title="$t('充值')"></CusNav>
    <div class="pl30 pr30 pt30 rel">
        
        <div class="cell card mb20 flex jb ac">
            <div class="size28 main">{{ $t('链') }}</div>
            <div class="size28 bold6">BEP20</div>
        </div>

        <div class="cell card mb20 flex jb ac">
            <div class="size28 main">{{ $t('币种') }}</div>
            <div class="size28 bold6 flex ac">
                <img src="@/assets/common/usdt.png" class="img48 mr10">
                <div>{{ assetUSDT }}</div>
            </div>
        </div>

        <div class="flex jc mt100">
            <div class="mainCard box flex jc ac">
                <QRCode :value="address" :size="160" :bordered="false" v-if="address" />
            </div>
        </div>

        <div class="cell card mb20 mt100">
            <div class="flex jb ac">
                <div class="size28 main">{{ $t('充值地址') }}</div>
                <img src="@/assets/user/17.png" class="img26 ml10">
            </div>
            <div class="br size24 bold5 lh40 opc6 mt30">{{ address }}</div>
        </div>

        <div class="mainBtn flex jc ac size28 bold6 mt40" v-copy="address" v-if="address">{{ $t('复制地址') }}</div>

    </div>
</template>

<script setup lang="ts">
import { apiRecharge } from '@/api/user';
import CusNav from '@/components/CusNav/index.vue'
import { assetUSDT } from '@/config';
import { onMounted, ref } from 'vue';

const address = ref()
const loadData = async () => {
    const res:any = await apiRecharge()
    address.value = res.recharge_address
}

onMounted(()=>{
    loadData()
})
</script>

<style lang="scss" scoped>
.card{
    border-radius: 20px;
    padding: 30px;
    &::before{
        border-radius: 20px;
    }
}
.box{
    width: 200PX;
    height: 200PX;
}
</style>
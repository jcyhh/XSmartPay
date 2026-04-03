<template>
    <div class="paytype flex jb ac" @click="paytype = 'balance_aix'">
        <div class="flex ac">
            <img src="@/assets/common/aix.png" class="img42 mr10">
            <div class="size28 bold6">{{ assetAIX }}</div>
        </div>
        <div class="flex ac">
            <div class="size28 opc5 mr10">{{ $t('余额') }}</div>
            <div class="size28 main mr10 bold5" v-init="userInfo?.balance_aix"></div>
            <img src="@/assets/user/30.png" class="img32 animate__animated animate__zoomIn ani3" v-if="paytype == 'balance_aix'">
            <img src="@/assets/user/31.png" class="img32" v-else>
        </div>
    </div>

    <div class="paytype flex jb ac mt20" @click="paytype = 'balance_nftc'">
        <div class="flex ac">
            <img src="@/assets/common/usdt.png" class="img42 mr10">
            <div class="size28 bold6">{{ assetNFTC }}</div>
        </div>
        <div class="flex ac">
            <div class="size28 opc5 mr10">{{ $t('余额') }}</div>
            <div class="size28 main mr10 bold5" v-init="userInfo?.balance_nftc"></div>
            <img src="@/assets/user/30.png" class="img32 animate__animated animate__zoomIn ani3" v-if="paytype == 'balance_nftc'">
            <img src="@/assets/user/31.png" class="img32" v-else>
        </div>
    </div>
</template>

<script setup lang="ts">
import { assetAIX, assetNFTC } from '@/config';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const paytype = defineModel<string>('paytype', { default: 'balance_aix' })
</script>

<style lang="scss" scoped>
.paytype{
    height: 90px;
    padding: 0 30px;
    background-color: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    border-radius: 14px;
}
</style>
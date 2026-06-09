<template>
    <div class="paytype flex jb ac" @click="paytype = 'balance_usdt'">
        <div class="flex ac">
            <img src="@/assets/common/usdt.png" class="img42 mr10">
            <div class="size28 bold6">{{ assetUSDT }}</div>
        </div>
        <div class="flex ac">
            <div class="size28 opc5 mr10">{{ $t('余额') }}</div>
            <div class="size28 main mr10 bold5" v-init="userInfo?.balance_usdt"></div>
            <img src="@/assets/user/30.png" class="img32 animate__animated animate__zoomIn ani3" v-if="paytype == 'balance_usdt'">
            <img src="@/assets/user/31.png" class="img32" v-else>
        </div>
    </div>

    <div class="paytype mt20" @click="paytype = 'usdt_aix'" v-if="isMixin">
        <div class="flex jb ac">
            <div class="size28 bold6">混合支付</div>
            <img src="@/assets/user/30.png" class="img32 animate__animated animate__zoomIn ani3" v-if="paytype == 'usdt_aix'">
            <img src="@/assets/user/31.png" class="img32" v-else>
        </div>
        <div class="flex jb ac mt20">
            <div class="flex ac">
                <img src="@/assets/common/usdt.png" class="img42 mr10">
                <div class="size28 bold6">{{ assetUSDT }}</div>
                <div class="opc6 main ml10">({{ card_usdt_pay_rate }}%)</div>
            </div>
            <div class="flex ac">
                <div class="size28 opc5 mr10">{{ $t('余额') }}</div>
                <div class="size28 main mr10 bold5" v-init="userInfo?.balance_usdt"></div>
            </div>
        </div>
        <div class="flex jb ac mt20">
            <div class="flex ac">
                <img src="@/assets/common/aix.png" class="img42 mr10">
                <div class="size28 bold6">{{ assetAIX }}</div>
                <div class="opc6 main ml10">({{ card_aix_pay_rate }}%)</div>
            </div>
            <div class="flex ac">
                <div class="size28 opc5 mr10">{{ $t('余额') }}</div>
                <div class="size28 main mr10 bold5" v-init="userInfo?.balance_aix"></div>
            </div>
        </div>
    </div>

    <div class="paytype flex jb ac mt20" @click="paytype = 'balance_aix'" v-else>
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
</template>

<script setup lang="ts">
import { assetAIX, assetUSDT } from '@/config';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';

defineProps({
    isMixin:{
        type: Boolean,
        default: false
    }
})

const userStore = useUserStore()
const { userInfo, card_usdt_pay_rate, card_aix_pay_rate } = storeToRefs(userStore)

const paytype = defineModel<string>('paytype', { default: 'balance_usdt' })
</script>

<style lang="scss" scoped>
.paytype{
    padding: 24px 30px;
    background-color: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    border-radius: 14px;
}
</style>
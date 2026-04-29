<template>
    <VanPopup v-model:show="show" style="background: transparent;" position="bottom" overlay-class="cusMask" teleport="#app">
        <div class="popup">
            <div class="content">
                <div class="flex jb ac">
                    <div class="size28 main bold6">{{ $t('卡片升级') }}</div>
                    <van-icon size="20" name="cross" color="#8D9094" @click="close" />
                </div>

                <div class="mt100 size48 bold tc" v-init="diff"></div>
                <div class="size24 mt20 opc5 tc">升级补差金额({{ assetUSDT }})</div>
                

                <div class="size28 bold6 mt100 mb30">{{ $t('支付方式') }}</div>
                <CusPaytype v-model:paytype="paytype"></CusPaytype>

                <div class="mainBtn flex jc ac size28 main bold6 btn mt50" @click="submit">确认升级</div>

                <div class="safeArea"></div>
                
            </div>
        </div>
    </VanPopup>
</template>

<script setup lang="ts">
import { assetUSDT } from '@/config';
import { computed, ref } from 'vue';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { computedSub } from '@/utils';
import { apiUpgradeVirtualCard } from '@/api/card';
import { message } from '@/utils/message';
import { t } from '@/locale';
import CusPaytype from '@/components/CusPaytype/pay.vue'

const emits = defineEmits(['success'])

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const paytype = ref('balance_usdt')

const show = ref(false)

const cardInfo = ref()

const diff = computed(()=>computedSub(cardInfo.value?.price, userInfo.value.card_amount))

const open = (data:any) => {
    userStore.loadUserInfo()
    cardInfo.value = data
    show.value = true
}

const close = () => show.value = false

const submit = async () => {
    await apiUpgradeVirtualCard({
        product_id: cardInfo.value.id
    })

    message(t('升级成功'), 'success')

    show.value = false

    userStore.loadUserInfo()

    emits('success')
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
.btn{
    height: 88px;
    border-radius: 44px;
}
.tag{
    height: 44px;
    border-radius: 22px;
    padding: 0 10px;
    border: 1px solid rgba(255, 255, 255, 0.5);
}
.inp{
    height: 90px;
    padding: 0 30px;
    background-color: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    border-radius: 14px;
    .line{
        width: 1px;
        height: 44px;
        background-color: #FFFFFF33;
    }
}
</style>
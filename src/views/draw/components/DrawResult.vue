<template>
    <VanPopup v-model:show="show" style="background: transparent;" position="bottom" overlay-class="cusMask" teleport="#app">
        <div class="popup">
            <div class="content">
                <div class="flex jb ac">
                    <div class="size28 main bold6">{{ $t('抽卡结果') }}</div>
                    <van-icon size="20" name="cross" color="#8D9094" @click="close" />
                </div>

                <div class="pt30" v-if="info?.type==1">
                    <div class="red size24">{{ $t('请支付抢卡资金，取消支付则此卡作废') }}</div>
                    <div class="mt100 flex jc ac">
                        <img src="@/assets/draw/8.png" class="pic8">
                        <img src="@/assets/draw/9.png" class="pic9">
                    </div>
                    <div class="tc mt50 size28 bold5">
                        <span>{{ $t('恭喜获取') }}</span>
                        <span class="main ml10">"{{ $t('0.99卡') }}"</span>
                    </div>
                    <div class="tc mt60 size48 bold main" v-init="0.99"></div>
                    <div class="tc mt20 size24 bold5 opc5">{{ $t('抢卡资金') }} ({{ assetUSDT }})</div>
                    <div class="size26 bold6 mt100 mb30">{{ $t('支付方式') }}</div>

                    <CusPaytype v-model:paytype="paytype"></CusPaytype>
                    <div class="mainButton mt40 flex jc ac size28 main bold6 btn" v-scale @click="submit">{{ $t('确认支付') }}</div>
                </div>

                <div class="pt160" v-else-if="info?.type==2">
                    <div class="flex jc ac">
                        <img src="@/assets/draw/8.png" class="pic8">
                        <img src="@/assets/draw/10.png" class="pic9">
                    </div>
                    <div class="tc mt50 size28 bold5">
                        <span>{{ $t('恭喜获取') }}</span>
                        <span class="main ml10">"{{ $t('再来一次') }}"</span>
                    </div>
                    <div class="mt200 tc size24 bold6">
                        <span class="mr5">{{ $t('抽卡次数') }}</span>
                        <span class="main">{{ Number(userInfo?.balance_lottery) }}</span>
                    </div>
                    <div class="mainButton mt40 flex jc ac size28 main bold6 btn" v-scale @click="again">{{ $t('继续抽卡') }}</div>
                </div>

                <div class="pt160" v-else>
                    <div class="flex jc ac">
                        <img src="@/assets/draw/11.png" class="pic9">
                    </div>
                    <div class="tc mt100 size28 bold5">
                        <span>{{ $t('谢谢参与') }}</span>
                    </div>
                    <div class="mt200 tc size24 bold6">
                        <span class="mr5">{{ $t('抽卡次数') }}</span>
                        <span class="main">{{ Number(userInfo?.balance_lottery) }}</span>
                    </div>
                    <div class="mainButton mt40 flex jc ac size28 main bold6 btn" v-scale @click="again">{{ $t('继续抽卡') }}</div>
                </div>

                <div class="safeArea"></div>
                
            </div>
        </div>
    </VanPopup>
</template>

<script setup lang="ts">
import { apiCard } from '@/api/card';
import { assetUSDT } from '@/config';
import { useConfetti } from '@/hooks/useConfetti';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import CusPaytype from '@/components/CusPaytype/index.vue'
import { message } from '@/utils/message';
import { t } from '@/locale';

const emits = defineEmits(['again'])

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const { showConfetti } = useConfetti()

const paytype = ref('balance_aix')

const show = ref(false)

const info = ref()

const open = (data:any) => {
    info.value =data
    show.value = true
    if(data.type<3)showConfetti()
}

const again = () => {
    userStore.loadUserInfo()
    show.value = false
    emits('again')
}

const close = () => show.value = false

const submit = async () => {
    await apiCard({
        rush_id: info.value?.rush_id,
        ccy: paytype.value
    })
    message(t('支付成功'), 'success')
    show.value = false
    userStore.loadUserInfo()
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
.pic8{
    width: 200px;
    height: 200px;
    animation: rotate 5s linear infinite;
}
.pic9{
    width: 146px;
    height: 146px;
    position: absolute;
    z-index: 1;
}
.btn{
    height: 88px;
    border-radius: 44px;
}
</style>
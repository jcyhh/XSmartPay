<template>
    <div class="rel mt40">
        <img src="@/assets/home/5.png" class="pic5">
        <div class="rel pt40 pb20">
            <div class="size24 opc5 tc">{{ $t('选择节点认购/质押') }}</div>
            <div class="flex jc ac mt18">
                <div class="flex ac" @click="pickerShow=true">
                    <div class="main size32 bold6">{{ currentPicker?.name }}</div>
                    <img src="@/assets/home/6.png" class="img24 ml10">
                </div>
            </div>
            <div class="flex jc mt60">
                <img :src="currentPicker?.image" class="cover">
            </div>
            <div class="tc opc5 size24 mt60">{{ $t('购买价格') }}</div>
            <div class="flex jc mt6 size60 bold">
                <div class="price">
                    <span v-init="currentPicker?.usdt_amount"></span>
                    <span class="ml10">{{ assetUSDT }}</span>
                </div>
            </div>
            <img src="@/assets/home/9.png" class="pic9 mt30">
            <div class="tc mt20">
                <span>{{ $t('剩余库存') }}</span>
                <span class="main ml10" v-init="currentPicker?.remain"></span>
            </div>
            <div class="mt40 pl30 pr30">
                <div class="mainButton btn flex jc ac size28 bold6 main" v-scale @click="openPopup">{{ $t('立即购买') }}
                </div>
            </div>
        </div>
    </div>

    <VanPopup v-model:show="showIntro" style="background: transparent;" :close-on-click-overlay="false"
        overlay-class="cusMask" teleport="#app">
        <div class="popupCenter mainCard">
            <div class="content">
                <div class="flex jb ac">
                    <div class="size28 main bold6">{{ $t('购买节点') }}</div>
                    <van-icon name="cross" :size="25" @click="showIntro=false" />
                </div>
                <div class="noticecontent mt30 size28" v-html="currentPicker?.intro"></div>
                <div class="mt50 flex ac bold5">
                    <div class="mainButton tipbtn flex1 flex jc ac main" @click="showIntro=false">{{ $t('取消') }}</div>
                    <div class="mainBtn tipbtn flex1 flex jc ac ml20" @click="openbuy">{{ $t('确认购买') }}</div>
                </div>
            </div>
        </div>
    </VanPopup>

    <VanPopup v-model:show="show" style="background: transparent;" :close-on-click-overlay="false"
        overlay-class="cusMask" teleport="#app">
        <div class="popupCenter mainCard">
            <div class="content">
                <div class="flex jb ac">
                    <div class="size28 main bold6">{{ $t('选择购买方式') }}</div>
                    <van-icon name="cross" :size="25" @click="show=false" />
                </div>

                <div class="cell mt40 size24" @click="current = 0">
                    <div class="flex jb ac">
                        <div class="size26">{{ assetUSDT }} {{ $t('购买') }}</div>
                        <div class="flex ac size26 bold6">
                            <div v-init="currentPicker?.usdt_amount"></div>
                            <div class="ml5 mr10">{{ assetUSDT }}</div>
                            <div class="animate__animated animate__zoomIn ani3" v-if="current == 0">
                                <van-icon name="checked" color="#FFE5A5" :size="20" />
                            </div>
                            <van-icon name="circle" color="#FFFFFF80" :size="20" v-else />
                        </div>
                    </div>
                    <div class="size22 opc5 mt15">
                        <span>{{ $t('购买后永久拥有') }}</span>
                    </div>
                </div>

                <div class="cell mt30 size24" @click="current = 1">
                    <div class="flex jb ac">
                        <div class="size26">{{ assetAIX }} {{ $t('质押') }}</div>
                        <div class="flex ac size26 bold6">
                            <div v-init="currentPicker?.aix_stake_amount"></div>
                            <div class="ml5 mr10">{{ assetAIX }}</div>
                            <div class="animate__animated animate__zoomIn ani3" v-if="current == 1">
                                <van-icon name="checked" color="#FFE5A5" :size="20" />
                            </div>
                            <van-icon name="circle" color="#FFFFFF80" :size="20" v-else />
                        </div>
                    </div>
                    <div class="size22 mt15">
                        <span class="mr5 main bold6" v-init="180"></span>
                        <span class="opc5">{{ $t('天后到期可赎回') }}</span>
                    </div>
                </div>

                <div class="size24 mt30">{{ $t('支付密码') }}</div>
                <div class="cell card mb20 flex jb ac mt20">
                    <input type="password" v-model="pay_password" :placeholder="$t('请输入支付密码')" class="flex1 size26">
                </div>

                <div class="mt50 flex ac bold5">
                    <div class="mainBtn flex1 flex jc ac" @click="confrim">{{ $t('确认') }}</div>
                </div>
            </div>
        </div>
    </VanPopup>

    <CusPicker v-model:show="pickerShow" :list="nodes" :title="$t('请选择')" :default-index="pickerCurrent"
        @change="$event => pickerCurrent = $event">
        <template v-slot="{ item }">
            <div class="size28 bold5">{{ item?.name }}</div>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import { assetAIX, assetUSDT } from '@/config';
import CusPicker from '@/components/CusPicker/index.vue';
import { computed, onMounted, ref } from 'vue';
import { t } from '@/locale';
import { apiBuyNode, apiNodes } from '@/api/home';
import { message } from '@/utils/message';

const show = ref(false)
const showIntro = ref(false)
const current = ref(0)
const pay_password = ref()

const nodes = ref<any[]>([])
const loadNodes = async () => {
    const res:any = await apiNodes()
    nodes.value = res.nodes
}

const pickerCurrent = ref(0)
const pickerShow = ref(false)
const currentPicker = computed(() => nodes.value[pickerCurrent.value])

const openPopup = () => {
    current.value = 0
    pay_password.value = ''
    setTimeout(() => {
        showIntro.value = true
    }, 300);
}

const openbuy = () => {
    showIntro.value = false
    setTimeout(() => {
        show.value = true
    }, 300);
}

const confrim = async () => {
    if(!pay_password.value)return message(t('请输入支付密码'))
    await apiBuyNode({
        node_product_id: currentPicker.value?.id,
        ccy: current.value == 0 ? 'balance_usdt' : 'balance_aix',
        pay_password: pay_password.value
    })
    message(t('购买成功'), 'success')
    show.value = false
}

onMounted(()=>{
    loadNodes()
})
</script>

<style lang="scss" scoped>
.pic5 {
    width: 100vw;
    height: 100vw;
    position: absolute;
    top: 0;
    left: 0;
}

.cover {
    width: 400px;
    height: 400px;
    transform-origin: 50% 58%;
    animation: coverFloat 4s ease-in-out infinite;
    will-change: transform;
}

@keyframes coverFloat {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-16px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .cover {
        animation: none;
    }
}

.price {
    display: inline-block;
    background: linear-gradient(281.88deg, #FFF1BF 24.66%, #FFF1BF 37.09%, #FFCD48 39.28%, #FFF1BF 59.99%, #FFCD48 64.38%, #FFF1BF 75.34%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}

.pic9 {
    width: 100%;
    height: 20px;
}

.btn {
    width: 100%;
    height: 88px;
}

.tipbtn{
    width: 100%;
    height: 80px;
}

.noticecontent{
    max-height: 60vh;
    width: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar{
        display: none;
    }
}
</style>

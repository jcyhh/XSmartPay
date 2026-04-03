<template>
    <div class="cardSwiperWrap">
        <swiper
            class="cardSwiper"
            :slides-per-view="'auto'"
            :space-between="space"
            :centered-slides="true"
            :initial-slide="defaultIndex"
            @swiper="onSwiper"
            @slide-change="onSlideChange"
        >
            <swiper-slide v-for="item in cardList" :key="item.id" class="cardSlide">
                <div class="cardBlock">
                    <img :src="item.cardIcon" class="cardImg">
                </div>
            </swiper-slide>
        </swiper>
    </div>

    <div class="gap200"></div>
    <div class="line mt65"></div>

    <div class="flex jb ac size24 mt30">
        <div>{{ currentCard?.name }}</div>
        <div class="opc5">
            <span class="mr10">{{ $t('库存') }}</span>
            <span>{{ currentCard?.stock }}</span>
        </div>
    </div>

    <div class="flex mt20">
        <div class="price bold">
            <span class="size48" v-init="currentCard?.price"></span>
            <span class="size28 ml10">{{ assetUSDT }}</span>
        </div>
    </div>

    <div class="flex ac mt30">
        <div class="update mainButton flex jc ac animate__animated animate__fadeInLeft ani3 mr20" v-scale @click="openUpgrade" v-if="diff > 0">
            <img src="@/assets/home/3.png" class="img40 mr10">
            <div class="size32 main">{{ $t('升级') }}</div>
        </div>
        <div class="mainBtn flex1 flex jc ac size32 bold5" @click="openCard">{{ $t('立即开卡') }}</div>
    </div>

    <OpenCard @success="loadData()" ref="openCardRef"></OpenCard>

    <OpenUpgrade @success="loadData()" ref="openUpgradeRef"></OpenUpgrade>
</template>

<script setup lang="ts">
import { computedSub, getAdaptPx } from '@/utils';
import { Swiper, SwiperSlide } from 'swiper/vue';
// @ts-ignore
import 'swiper/css';
import { assetUSDT } from '@/config';
import OpenCard from './OpenCard.vue';
import OpenUpgrade from './OpenUpgrade.vue';
import { computed, nextTick, onMounted, ref } from 'vue';
import { apiProduct } from '@/api/home';
import { useCardIcon } from '@/hooks/useCardIcon';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const { getCardIcon } = useCardIcon()

const openCardRef = ref()
const openUpgradeRef = ref()
const mySwiper = ref()

const cardList = ref<any[]>([])
const currentIndex = ref(0)
const defaultIndex = ref(0)
const currentCard = computed(() => cardList.value[currentIndex.value] || null)
const onSwiper = (swiper: any) => {
    mySwiper.value = swiper
}
const onSlideChange = (swiper: any) => {
    currentIndex.value = Number(swiper?.realIndex ?? swiper?.activeIndex ?? 0)
}
const openUpgrade = () => {
    openUpgradeRef.value?.open(currentCard.value)
}
const openCard = () => {
    openCardRef.value?.open(currentCard.value)
}
const loadData = async () => {
    const res:any = await apiProduct()
    cardList.value = res.products.map((item:any)=>{
        return {
            ...item,
            ...{
                cardIcon: getCardIcon(item.id)
            }
        }
    })
    defaultIndex.value = cardList.value.length > 1 ? 1 : 0
    currentIndex.value = defaultIndex.value
    await nextTick()
    mySwiper.value?.slideTo(defaultIndex.value, 0)
}

const diff = computed(()=>{
    if(userInfo.value?.card_amount == 0)return 0
    return computedSub(currentCard.value?.price, userInfo.value?.card_amount)
})

// 卡
const space = getAdaptPx(30)

onMounted(()=>{
    loadData()
})

defineExpose({
    currentCard
})
</script>

<style lang="scss" scoped>
.line{
    width: 100%;
    height: 1px;
    background-color: #FFFFFF1A;
}
.cardSwiperWrap{
    width: 100vw;
    overflow: hidden;
    position: absolute;
    top: 78px;
    left: -30px;
    z-index: 1;
}
.cardSwiper{
    width: 100vw;
    overflow: visible;
}
.cardSlide{
    width: 308px;
}
.cardBlock{
    width: 308px;
    height: 265px;
    padding-top: 40px;
    .cardImg{
        width: 308px;
        height: 185px;
    }
}
.price{
    display: inline-block;
    background: linear-gradient(281.88deg, #FFF1BF 24.66%, #FFF1BF 37.09%, #FFCD48 39.28%, #FFF1BF 59.99%, #FFCD48 64.38%, #FFF1BF 75.34%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}
.update{
    width: 250px;
    height: 74px;
}
</style>
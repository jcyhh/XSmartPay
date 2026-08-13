<template>
    <CusNav :show-bg="false" :title="$t('NFT市场')">
        <div class="tr size24 main" @click="routerPush('/user/nft/bind-store')">{{ $t('绑定店铺') }}</div>
    </CusNav>

    <div class="pl30 pr30 mt30">
        <section class="market mainCard">
            <div ref="marketTypesRef" class="marketTypes">
                <div
                    v-for="(item, index) in marketTypes"
                    :key="item.name"
                    class="marketType flex0 size24"
                    :data-market-type-index="index"
                    :class="{ active: marketTypeCurrent === index }"
                    @click="selectMarketType(index, $event)"
                >
                    {{ item.name }}
                </div>
            </div>

            <div class="marketSwiperWrap">
                <swiper
                    v-if="marketCards.length"
                    class="marketSwiper"
                    :slides-per-view="'auto'"
                    :space-between="marketSpace"
                    :centered-slides="true"
                    :initial-slide="marketInitialIndex"
                    :loop="false"
                    @swiper="onMarketSwiper"
                    @slide-change="onMarketSlideChange"
                >
                    <swiper-slide v-for="item in marketCards" :key="item.id" class="marketSlide">
                        <img :src="mockImage" :alt="item.name" class="marketImage">
                    </swiper-slide>
                </swiper>
            </div>

            <div class="flex jb ac pl20 pr20">
                <img src="@/assets/user/44.png" class="img48" @click="marketSwiper?.slidePrev()">
                <div class="marketPrice bold">
                    <span v-init="currentMarketCard?.price"></span>
                    <span class="ml10">{{ currentMarketCard?.currency }}</span>
                </div>
                <img src="@/assets/user/45.png" class="img48" @click="marketSwiper?.slideNext()">
            </div>

            <div class="mainBtn marketExchange flex jc ac size28 bold5" @click="openExchangeAsk">{{ $t('兑换') }}</div>
        </section>
    </div>

    <CusTab v-model="current" :list="tabs"></CusTab>

    <van-pull-refresh class="fullPage rel" v-bind="props">
        <van-list class="fullPage" v-bind="listProps">
            <div class="pl30 pr30 rel">
                <div class="cell card mb20" v-for="(item, index) in list" :key="index">
                    <div class="flex ac">
                        <img :src="mockImage" class="img100 avatar">
                        <div class="flex1">
                            <div class="flex jb ac">
                                <div class="size28 bold6 main">{{ item.name }}</div>
                                <div class="size24 bold6 main">
                                    <span v-init="item.amount"></span>
                                    <span class="ml5">NFTC</span>
                                </div>
                            </div>
                            <div class="mt10 flex jb ac size24 opc5">
                                <div>{{ item.created_at }}</div>
                                <div>{{ $t('价值') }}</div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <CusEmpty v-if="list?.length == 0"></CusEmpty>
            </div>
        </van-list>
    </van-pull-refresh>

    <CusAsk v-model:show="showExchangeAsk" @submit="exchange">
        {{ $t('确认兑换 {name} 吗？', { name: currentMarketCard?.name || '' }) }}
    </CusAsk>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusTab from '@/components/CusTab/index.vue'
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue'
import CusAsk from '@/components/CusAsk/index.vue'
import { t } from '@/locale';
import { computed, onMounted, ref, watch } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
// @ts-ignore
import 'swiper/css';
import { getAdaptPx } from '@/utils';
import { routerPush } from '@/router';
import { apiBuyNft, apiNftCards } from '@/api/nft';
import { assetNFTC } from '@/config';
import mockImage from '@/assets/mock.png'
import { message } from '@/utils/message';

const current = ref(0)
const tabs = computed(() => ([
    { name: t('待绑定'), value: 0 },
    { name: t('已绑定'), value: 1 }
]))

interface NftCard {
    id: number
    name: string
    image: string
    price: number | string
    count_num: number
    show_count_num: number
    currency: string
}

const marketCards = ref<NftCard[]>([])
const marketTypes = computed(() => marketCards.value)
const marketTypeCurrent = ref(0)
const marketTypesRef = ref<HTMLElement>()
const marketSwiper = ref<any>()
const marketCurrent = ref(0)
const showExchangeAsk = ref(false)
const marketInitialIndex = computed(() => 0)
const currentMarketCard = computed(() => marketCards.value[marketCurrent.value])
const marketSpace = getAdaptPx(100)
const onMarketSwiper = (swiper: any) => {
    marketSwiper.value = swiper
}
const onMarketSlideChange = (swiper: any) => {
    const index = Math.min(Number(swiper?.realIndex ?? swiper?.activeIndex ?? 0), marketCards.value.length - 1)
    marketCurrent.value = index
    marketTypeCurrent.value = index
    scrollMarketTypeIntoView(index)
}
const selectMarketType = (index: number, event: MouseEvent) => {
    marketTypeCurrent.value = index
    moveMarketTo(index)
    ;(event.currentTarget as HTMLElement)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
    })
}
const moveMarketTo = (index: number) => {
    const swiper = marketSwiper.value
    if (!swiper || marketCards.value.length === 0) return
    swiper.slideTo(index)
}
const scrollMarketTypeIntoView = (index: number) => {
    marketTypesRef.value
        ?.querySelector<HTMLElement>(`[data-market-type-index="${index}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
}

const loadMarketCards = async () => {
    const res: any = await apiNftCards()
    marketCards.value = (res.nodes ?? []).map((item: Omit<NftCard, 'currency'>) => ({
        ...item,
        currency: assetNFTC
    }))
    marketCurrent.value = marketInitialIndex.value
    marketTypeCurrent.value = marketInitialIndex.value
}

const params = computed(() => ({ is_bind: tabs.value[current.value].value }))
const { list, props: listProps, loadList } = useLoadList('/api/node', 'node_orders', params)
const { props } = usePullRefresh(loadList)

const openExchangeAsk = () => {
    if (currentMarketCard.value) showExchangeAsk.value = true
}
const exchange = async () => {
    const card = currentMarketCard.value
    if (!card) return

    await apiBuyNft({ node_id: card.id })
    message(t('购买成功'), 'success')
    showExchangeAsk.value = false
    loadMarketCards()
    loadList()
}

watch(current, () => loadList(), { immediate: true })

onMounted(() => {
    loadMarketCards()
})
</script>

<style lang="scss" scoped>
.card {
    padding: 24px 24px 20px 24px;
    border-radius: 20px;

    &::before {
        border-radius: 20px;
    }

    .avatar {
        border-radius: 16px;
        margin-right: 20px;
    }

    .line {
        width: 100%;
        height: 1px;
        background-color: #FFFFFF33;
    }

    .desc {
        width: 300px;
    }

    .btn {
        height: 60px;
        padding: 0 20px;
        border-radius: 30px;
        font-size: 28px;
        font-weight: 600;
    }
}

.market {
    overflow: visible;
    padding: 30px 20px 30px 20px;

    .marketTypes {
        display: flex;
        gap: 17px;
        width: calc(100% + 40px);
        margin-left: -20px;
        padding: 0 20px;
        overflow-x: auto;
        overflow-y: hidden;
        overscroll-behavior-x: contain;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
        touch-action: pan-x;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .marketType {
        min-width: 150px;
        text-align: center;
        height: 56px;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        color: #FFFFFF;
        background-color: #FFFFFF1A;
        transition: all .3s ease;
        padding: 0 20px;

        &.active {
            color: #FDE3A5;
            font-weight: 700;
            border-color: #FDE3A5;
            background-color: #FDE3A51A;
        }
    }

    .marketSwiperWrap {
        width: 100vw;
        height: 380px;
        margin: 20px 0 0;
        position: relative;
        left: -50px;
        overflow: hidden;
    }

    .marketSwiper {
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    .marketSlide {
        width: 178px;
        height: 240px;
        margin-top: 76px;
        opacity: 1;
        transform: scale(.8);
        transition: transform .3s ease;
    }

    .marketImage {
        width: 178px;
        height: 240px;
        display: block;
        object-fit: cover;
        border-radius: 20px;
    }

    :deep(.swiper-slide-active) {
        transform: scale(1);
    }

    .marketPrice {
        text-align: center;
        font-size: 48px;
        background: linear-gradient(281.88deg, #FFF1BF 24.66%, #FFF1BF 37.09%, #FFCD48 39.28%, #FFF1BF 59.99%, #FFCD48 64.38%, #FFF1BF 75.34%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
    }

    .marketExchange {
        width: 100%;
        height: 80px;
        margin-top: 42px;
        border-radius: 40px;
    }
}

.box {
    background: linear-gradient(#C19F4F4D, #C19F4F00);
    padding: 40px 10px 12px 10px;
    border-radius: 20px;
}

.btn {
    height: 88px;
    border-radius: 44px;
}

.bottom {
    width: 100vw;
    padding: 20px 30px 30px 30px;
    background-color: #040404;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
}
</style>

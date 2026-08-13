<template>
    <CusNav :title="$t('绑定店铺')" :show-bg="false"></CusNav>

    <img src="@/assets/user/47.png" class="bg">
    <div class="heroText">
        <div class="heroTitle">
            <div>{{ $t('绑定优质店铺') }}</div>
            <div>
                <span>{{ $t('共享') }}</span>
                <span class="heroHighlight">{{ $t('长期收益') }}</span>
            </div>
        </div>
        <div class="heroDesc size24 mt10">{{ $t('持有并绑定指定NFT，即可获得店铺权益') }}</div>
    </div>

    <div class="gap200"></div>
    <div class="gap200"></div>
    <div class="gap200"></div>
    
    <CusTab v-model="current" :list="tabs" :show-bg="false" :sticky="false" show-glass></CusTab>
    <div class="pl30 pr30">
        <div class="cell storeCard mb20" v-for="item in currentList" :key="item.id">
            <div class="flex ac">
                <img :src="mockImage" :alt="item.name" class="storeLogo">
                <div class="flex1 ml20">
                    <div class="flex jb ac size28">
                        <div class="flex ac minw0">
                            <span class="textEllipsis">{{ item.name }}</span>
                            <img v-if="current === 0" src="@/assets/user/46.png" class="img24 ml10" @click="openDescription(item)">
                        </div>
                        <div class="size28 bold6 main flex0" v-if="current === 1" v-init="item.amount"></div>
                    </div>

                    <div class="mt20 flex jb ac" v-if="current === 1">
                        <div class="size24 opc5">NFT：{{ item.nft }}</div>
                        <div class="size24 main flex0">USDT</div>
                    </div>
                </div>
                <div class="mainButton benefitButton flex jc ac size24 main bold5 ml20" v-if="current === 0" @click="openBenefitAsk(item)">{{ $t('购买权益') }}</div>
            </div>
        </div>
    </div>

    <CusAsk
        v-model:show="benefitAskShow"
        :title="$t('购买权益')"
        :submit-txt="$t('确认购买')"
        @submit="bindNftToShop"
    >
        <div class="nftSelect flex jb ac" @click="openNftPicker">
            <div class="flex ac">
                <img v-if="selectedNft" :src="mockImage" :alt="selectedNft.name" class="img48 mr10">
                <span :class="{ opc5: !selectedNft }">{{ selectedNft?.name || $t('选择绑定的NFT') }}</span>
            </div>
            <van-icon name="arrow" class="opc5" />
        </div>
    </CusAsk>

    <CusPicker
        v-model:show="nftPickerShow"
        :list="unboundNfts"
        :title="$t('请选择')"
        :default-index="nftPickerCurrent"
        allow-empty
        @change="onNftChange"
    >
        <template #default="{ item }">
            <div class="flex jc ac">
                <img :src="mockImage" :alt="item.name" class="img48 mr10">
                <span class="size28 bold5">{{ item.name }}</span>
            </div>
        </template>
    </CusPicker>

    <van-popup v-model:show="descriptionShow" style="background-color: transparent !important;" overlay-class="cusMask" teleport="#app">
        <div class="popupCenter mainCard">
            <div class="flex jb ac">
                <div class="size28 bold">{{ $t('店铺介绍') }}</div>
                <van-icon size="20" name="cross" color="#8D9094" @click="descriptionShow = false" />
            </div>
            <div class="noticecontent mt30 size28" v-html="descriptionStore?.description"></div>
            <div class="flex ac mt60 font2 size28">
                <div class="mainBtn flex1 flex jc ac" @click="descriptionShow = false">{{ $t('知道了') }}</div>
            </div>
        </div>
    </van-popup>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusTab from '@/components/CusTab/index.vue'
import CusPicker from '@/components/CusPicker/index.vue'
import CusAsk from '@/components/CusAsk/index.vue'
import { t } from '@/locale'
import { computed, onMounted, ref } from 'vue'
import mockImage from '@/assets/mock.png'
import { apiBindNftShop, apiNftBindings, apiNftOrders, apiNftShops } from '@/api/nft'
import { message } from '@/utils/message'

const current = ref(0)
const tabs = computed(() => ([
    { name: t('待绑定店铺'), value: 0 },
    { name: t('已绑定店铺'), value: 1 }
]))

interface StoreItem {
    id: number
    name: string
    logo: string
    amount: number | string
    nft?: string
    description?: string
}

interface NftOrder {
    id: number
    name: string
    image: string
}

const pendingStores = ref<StoreItem[]>([])
const bindings = ref<StoreItem[]>([])
const currentList = computed(() => current.value === 0 ? pendingStores.value : bindings.value)
const selectedShop = ref<StoreItem>()
const unboundNfts = ref<NftOrder[]>([])
const nftPickerShow = ref(false)
const nftPickerCurrent = ref(-1)
const benefitAskShow = ref(false)
const descriptionShow = ref(false)
const descriptionStore = ref<StoreItem>()
const selectedNft = computed(() => nftPickerCurrent.value >= 0 ? unboundNfts.value[nftPickerCurrent.value] : undefined)

const loadPendingStores = async () => {
    const res: any = await apiNftShops({ page_no: 1, page_size: 20 })
    pendingStores.value = (res.shops ?? []).map((item: any) => ({
        id: item.id,
        name: item.name,
        logo: item.logo,
        amount: item.amount,
        description: item.description
    }))
}

const loadBindings = async () => {
    const res: any = await apiNftBindings({ page_no: 1, page_size: 20 })
    bindings.value = (res.bindings ?? []).map((item: any) => ({
        id: item.id,
        name: item.shop_name,
        logo: item.shop_logo,
        amount: item.aix_amount,
        nft: item.nft_name
    }))
}

const loadData = () => Promise.all([loadPendingStores(), loadBindings()])

const openBenefitAsk = (shop: StoreItem) => {
    selectedShop.value = shop
    unboundNfts.value = []
    nftPickerCurrent.value = -1
    benefitAskShow.value = true
}

const openDescription = (shop: StoreItem) => {
    descriptionStore.value = shop
    descriptionShow.value = true
}

const openNftPicker = async () => {
    const res: any = await apiNftOrders({ page_no: 1, page_size: 999, is_bind: 0 })
    unboundNfts.value = res.node_orders ?? []
    nftPickerCurrent.value = -1
    nftPickerShow.value = true
}

const onNftChange = (index: number) => {
    nftPickerCurrent.value = index
}

const bindNftToShop = async () => {
    const shop = selectedShop.value
    const nft = selectedNft.value
    if (!shop || !nft) return message(t('请选择'))

    await apiBindNftShop({ shop_id: shop.id, node_order_id: nft.id })
    message(t('购买成功'), 'success')
    benefitAskShow.value = false
    loadData()
}

onMounted(loadData)
</script>

<style lang="scss" scoped>
.bg{
    width: 100vw;
    height: 800px;
    position: absolute;
    top: 0;
    left: 0;
}
.heroText {
    width: 438px;
    position: absolute;
    top: 128px;
    left: 50%;
    z-index: 1;
    transform: translateX(-50%);
    text-align: center;
}

.heroTitle {
    font-size: 60px;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: 1px;
    background: linear-gradient(180deg, #FFFFFF 0%, #FFE1BA 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}

.heroHighlight {
    margin-left: 12px;
    background: linear-gradient(180deg, #F9BD27 0%, #FF7900 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}

.heroDesc {
    color: #D2B496;
}

.storeCard {
    min-height: 160px;
    padding: 20px;
    border-radius: 20px;

    &::before {
        border-radius: 20px;
    }
}

.storeLogo {
    width: 120px !important;
    min-width: 120px;
    max-width: 120px;
    height: 120px !important;
    aspect-ratio: 1 / 1;
    flex: 0 0 120px;
    border-radius: 20px;
    object-fit: cover;
}

.benefitButton {
    min-width: 150px;
    height: 60px;
    padding: 0 20px;
    white-space: nowrap;
    border-radius: 30px;
}

.nftSelect {
    height: 88px;
    padding: 0 24px;
    border: 1px solid #FFFFFF1A;
    border-radius: 14px;
    background: #FFE5A51F;
}

.noticecontent {
    width: 100%;
    max-height: 60vh;
    overflow-y: auto;
    line-height: 1.65;

    &::-webkit-scrollbar {
        display: none;
    }
}
</style>

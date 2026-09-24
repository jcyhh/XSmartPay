<template>
    <div class="benefit-page">
        <img :src="storeHero" alt="" class="benefit-background benefit-background--top animate__animated animate__zoomIn">
        <img :src="pageBackground" alt="" class="benefit-background benefit-background--bottom animate__animated animate__fadeIn">

        <main class="benefit-content pl30 pr30">
            <section class="benefit-intro">
                <h1 class="size60 bold6">{{ $t('绑定优质商城') }}</h1>
                <p class="size24">{{ $t('持有并绑定指定 NFT，共享长期收益') }}</p>
            </section>

            <section class="country-card rel mt40">
                <img :src="cardFrame" alt="" class="country-card__frame">
                <img v-if="countryFlag" :src="countryFlag" alt="" class="country-card__flag" @error="onCountryLogoError(selectedCountry?.id)">
                <div class="country-card__details">
                    <div class="country-card__name bold6">{{ selectedCountry?.name || $t('请选择国家') }}</div>
                    <div class="country-card__status flex ac size24">
                        <span class="country-card__dot"></span>
                        {{ $t('绑定国家') }}
                    </div>
                </div>
                <div class="mainButton country-card__select flex jc ac main bold6" @click="openCountryPicker">
                    {{ $t('选择国家') }}
                </div>
            </section>

            <div class="nft-select flex jb ac mt40 size28" @click="openNftPicker">
                <span>{{ $t('选择NFT') }}</span>
                <span class="flex ac yellow">
                    {{ selectedNft?.name || $t('请选择') }}
                    <van-icon name="arrow" class="nft-select__arrow ml10" />
                </span>
            </div>

            <section class="amount-card mt30">
                <div class="flex jb ac size24">
                    <span class="bold5">{{ $t('绑定金额') }}</span>
                </div>
                <div class="amount-card__input flex jb ac">
                    <input v-model="amount" type="number" inputmode="decimal" placeholder="0.00" :aria-label="$t('绑定金额')" class="flex1">
                    <div class="amount-card__currency flex ac bold6 size28">
                        <img :src="usdtIcon" alt="" class="img32 mr6">
                        USDT
                    </div>
                </div>
                <div class="amount-card__line"></div>
                <div class="flex jb ac mt20 size24">
                    <span class="red">≈ <span v-init="estimatedAix"></span> AIX</span>
                    <span class="flex ac">
                        <img :src="walletIcon" alt="" class="img24 mr8">
                        <span v-init="userInfo?.balance_aix"></span> AIX
                        <span class="green ml10" @click="inputAll">{{ $t('全部') }}</span>
                    </span>
                </div>
                <div class="amount-card__rate size24 opc5 mt30">
                    {{ $t('参考汇率') }}：1 USDT ≈ <span v-if="price.isGreaterThan(0)" v-init="aixRate"></span><span v-else>--</span> AIX
                </div>
                <div class="amount-card__password flex jb ac size26">
                    <label for="benefit-pay-password">{{ $t('支付密码') }}</label>
                    <input id="benefit-pay-password" v-model="payPassword" type="password" inputmode="numeric" autocomplete="current-password" :placeholder="$t('请输入')" class="flex1">
                </div>
            </section>

            <div class="mainBtn benefit-submit flex jc ac bold6 size32 mt40" @click="submit">
                {{ $t('立即绑定') }}
            </div>
            <div class="mainButton benefit-list flex jc ac main bold6 size28 mt20" @click="routerPush('/benefit/bindings')">
                {{ $t('绑定列表') }}
            </div>
            <div class="gap100"></div>
        </main>
    </div>

    <CusPicker v-model:show="countryPickerShow" :list="countries" :default-index="countryPickerCurrent" :is-item-disabled="isCountryDisabled" allow-empty :title="$t('请选择国家')" @change="onCountryChange">
        <template #default="{ item }">
            <div class="flex jc ac">
                <img v-if="getCountryFlag(item)" :src="getCountryFlag(item)" :alt="item.name" class="img48 mr10" @error="onCountryLogoError(item.id)">
                <span class="size28 bold5">{{ item.name }}</span>
                <span v-if="item.status === 0" class="size24 ml10">{{ $t('(待开放)') }}</span>
            </div>
        </template>
    </CusPicker>

    <CusPicker v-model:show="nftPickerShow" :list="unboundNfts" :default-index="nftPickerCurrent" allow-empty :title="$t('选择NFT')" @change="nftPickerCurrent = $event">
        <template #default="{ item }">
            <div class="flex jc ac">
                <img :src="item.image" :alt="item.name" class="img48 mr10">
                <span class="size28 bold5">{{ item.name }}</span>
            </div>
        </template>
    </CusPicker>

</template>

<script setup lang="ts">
import CusPicker from '@/components/CusPicker/index.vue'
import { apiConfig } from '@/api/home'
import { apiBindCountry, apiNftOrders, apiNftShops } from '@/api/nft'
import { useUserStore } from '@/store'
import { routerPush } from '@/router'
import { t } from '@/locale'
import { message } from '@/utils/message'
import BigNumber from 'bignumber.js'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import cardFrame from '@/assets/benefit/benefit-card-frame.webp'
import chinaFlag from '@/assets/benefit/china-flag.png'
import pageBackground from '@/assets/benefit/page-background.webp'
import storeHero from '@/assets/benefit/store-hero.webp'
import walletIcon from '@/assets/benefit/wallet.svg'
import usdtIcon from '@/assets/common/usdt.png'

interface NftOrder {
    id: number
    name: string
    image: string
}

interface Country {
    id: number
    name: string
    logo: string
    status: 0 | 1
}

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const countries = ref<Country[]>([])
const countryPickerShow = ref(false)
const countryPickerCurrent = ref(-1)
const selectedCountry = computed(() => countries.value[countryPickerCurrent.value])
const isCountryDisabled = (country: Country) => country.status !== 1
const onCountryChange = (index: number) => {
    if (countries.value[index]?.status === 1) countryPickerCurrent.value = index
}
const brokenCountryLogoIds = ref<number[]>([])
const getCountryFlag = (country?: Country) => {
    if (!country) return ''
    if (country.logo && !brokenCountryLogoIds.value.includes(country.id)) return country.logo
    return country.name === 'China' || country.name === '中国' ? chinaFlag : ''
}
const countryFlag = computed(() => getCountryFlag(selectedCountry.value))
const onCountryLogoError = (id?: number) => {
    if (id !== undefined && !brokenCountryLogoIds.value.includes(id)) brokenCountryLogoIds.value.push(id)
}
const nftPickerShow = ref(false)
const nftPickerCurrent = ref(-1)
const unboundNfts = ref<NftOrder[]>([])
const selectedNft = computed(() => unboundNfts.value[nftPickerCurrent.value])
const amount = ref<number | string>('')
const payPassword = ref('')
const submitting = ref(false)
const aixPrice = ref('0')
const price = computed(() => new BigNumber(aixPrice.value || 0))
const aixRate = computed(() => price.value.isGreaterThan(0) ? new BigNumber(1).div(price.value).toNumber() : 0)
const estimatedAix = computed(() => {
    const input = new BigNumber(amount.value || 0)
    return price.value.isGreaterThan(0) && input.isFinite()
        ? input.div(price.value).toNumber()
        : 0
})
const loadCountries = async () => {
    const items: Country[] = []
    for (let page = 1; ; page += 1) {
        const res: any = await apiNftShops({ page_no: page, page_size: 20 })
        const pageItems: Country[] = res.shops ?? []
        items.push(...pageItems)
        if (pageItems.length < 20) break
    }
    countries.value = items
}
const openCountryPicker = async () => {
    if (countries.value.length === 0) {
        try {
            await loadCountries()
        } catch {
            return
        }
    }
    if (countries.value.length === 0) return message(t('暂无可选国家'))
    countryPickerShow.value = true
}
const loadNfts = async () => {
    const res: any = await apiNftOrders({ page_no: 1, page_size: 999, is_bind: 0 })
    unboundNfts.value = res.node_orders ?? []
}

const openNftPicker = async () => {
    if (unboundNfts.value.length === 0) {
        try {
            await loadNfts()
        } catch {
            return
        }
    }
    if (unboundNfts.value.length === 0) return message(t('暂无可绑 NFT'))
    nftPickerShow.value = true
}

const inputAll = () => {
    const balance = new BigNumber(userInfo.value?.balance_aix ?? 0)
    if (!price.value.isGreaterThan(0) || !balance.isFinite()) return
    amount.value = balance.times(price.value).decimalPlaces(6, BigNumber.ROUND_DOWN).toFixed()
}

const submit = async () => {
    if (submitting.value) return
    if (!selectedCountry.value) return message(t('请选择国家'))
    if (!selectedNft.value) return message(t('选择NFT'))
    if (String(amount.value).trim() === '') return message(t('请输入绑定金额'))
    if (!payPassword.value) return message(t('请输入支付密码'))

    submitting.value = true
    try {
        await apiBindCountry({
            shop_id: selectedCountry.value.id,
            node_order_id: selectedNft.value.id,
            amount: Number(new BigNumber(amount.value).toFixed(6, BigNumber.ROUND_DOWN)),
            pay_password: payPassword.value
        })
        message(t('绑定成功'), 'success')
        amount.value = ''
        payPassword.value = ''
        nftPickerCurrent.value = -1
        unboundNfts.value = []
        await Promise.allSettled([loadNfts(), userStore.loadUserInfo()])
    } catch {
        // 请求拦截器统一展示接口错误。
    } finally {
        submitting.value = false
    }
}

onMounted(async () => {
    const [config] = await Promise.allSettled([apiConfig(), loadCountries(), loadNfts(), userStore.loadUserInfo()])
    if (config.status === 'fulfilled') aixPrice.value = String((config.value as any)?.aix_price || 0)
})
</script>

<style lang="scss" scoped>
.benefit-page {
    min-height: 100%;
    position: relative;
    isolation: isolate;
}

.benefit-content {
    position: relative;
    z-index: 1;
    padding-top: 90px;
    padding-bottom: 30px;
}

.benefit-intro {
    h1 {
        line-height: 1.25;
        background: linear-gradient(#fff, #ffe1ba);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }

    p {
        margin-top: 20px;
        color: #d2b496;
    }
}

.country-card {
    height: 318px;

    &__frame {
        width: 100%;
        height: 100%;
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    &__flag {
        width: 140px;
        height: 95px;
        position: absolute;
        top: 0;
        right: 20px;
        border-radius: 16px;
    }

    &__details {
        position: absolute;
        top: 22px;
        left: 30px;
    }

    &__name {
        font-size: 56px;
        line-height: 1.25;
        background: linear-gradient(90deg, #efb152, #efcd80 49.4%, #efb152);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }

    &__status {
        margin-top: 12px;
        color: #15ff00;
    }

    &__dot {
        width: 8px;
        height: 8px;
        margin-right: 10px;
        border-radius: 50%;
        background: currentColor;
    }

    &__select {
        height: 88px;
        position: absolute;
        right: 30px;
        bottom: 40px;
        left: 30px;
        font-size: 32px;
        cursor: pointer;
    }
}

.nft-select {
    height: 90px;
    padding: 0 30px;
    border: 1px solid #ffffff1a;
    border-radius: 999px;
    background: #ffffff1f;
    cursor: pointer;

    &__arrow {
        color: #ffffff80;
    }
}

.amount-card {
    height: 467px;
    padding: 28px 30px 30px;
    border: 2px solid #ffffff1a;
    border-radius: 32px;
    background: #ffffff1a;

    &__input {
        height: 132px;

        input {
            min-width: 0;
            color: #fff;
            font-size: 56px;
            font-weight: 600;

            &::placeholder {
                color: #ffffff4d;
            }
        }
    }

    &__currency {
        height: 60px;
        padding: 0 15px;
        border: 1px solid #ffffff1a;
        border-radius: 999px;
        background: #c4c4c41a;
    }

    &__line {
        height: 1px;
        background: #ffffff1a;
    }

    &__rate {
        color: #fff;
    }

    &__password {
        height: 90px;
        margin-top: 36px;
        padding: 0 30px;
        border-radius: 20px;
        background: #ffffff1a;

        input {
            min-width: 0;
            text-align: right;
            color: #fff;
            font-size: 28px;
        }
    }
}

.benefit-submit,
.benefit-list {
    height: 80px;
    border-radius: 999px;
    cursor: pointer;
}

.benefit-background {
    width: 100vw;
    height: auto;
    position: fixed;
    left: 0;
    z-index: -1;
    pointer-events: none;

    &--top {
        top: 0;
        transform-origin: right top;
    }

    &--bottom {
        bottom: 100px;
    }
}
</style>

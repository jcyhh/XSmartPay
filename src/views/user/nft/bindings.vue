<template>
    <div class="binding-list-page">
        <CusNav :title="$t('绑定列表')" :show-bg="false" />

        <van-pull-refresh v-bind="refreshProps">
            <van-list v-bind="listProps">
                <main class="binding-list">
                    <article v-for="item in bindings" :key="item.id" class="binding-card">
                        <img :src="cardFrame" alt="" class="binding-card__frame">
                        <img v-if="item.logo || item.name === 'China'" :src="item.logo || chinaFlag" :alt="item.name" class="binding-card__flag">
                        <div class="binding-card__country bold6">{{ item.name }}</div>

                        <div class="binding-card__label size24">{{ $t('绑定金额') }}</div>
                        <div class="binding-card__amount flex ac bold6">
                            <img :src="usdtIcon" alt="" class="binding-card__usdt">
                            <span class="binding-card__amount-number" v-init="item.amount"></span>
                            <span class="binding-card__amount-unit">USDT</span>
                        </div>
                        <div class="binding-card__exchange size24">≈ <span v-init="item.aix_amount"></span> AIX</div>

                        <div class="binding-card__nft size24">{{ $t('绑定NFT') }}：{{ item.nft_name }}</div>
                        <div class="binding-card__date size24">{{ formatDate(item.created_at) }}</div>
                        <div class="binding-card__divider"></div>

                        <div class="binding-card__earnings size26">
                            <div class="binding-card__earnings-row flex jb ac">
                                <span class="binding-card__muted">{{ $t('总收益') }}</span>
                                <span class="binding-card__total"><span v-init="item.total_income"></span> USDT</span>
                            </div>
                            <div class="binding-card__earnings-row flex jb ac">
                                <span class="binding-card__muted">{{ $t('今日收益') }}</span>
                                <span><span v-init="item.today_income"></span> USDT</span>
                            </div>
                        </div>
                    </article>
                    <CusEmpty v-if="listData && !loading && bindings.length === 0" />
                </main>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusEmpty from '@/components/CusEmpty/index.vue'
import cardFrame from '@/assets/benefit/benefit-card-frame-large.webp'
import chinaFlag from '@/assets/benefit/china-flag.png'
import usdtIcon from '@/assets/common/usdt.png'
import { useLoadList } from '@/hooks/useLoadList'
import { usePullRefresh } from '@/hooks/usePullRefresh'
import { computed, onMounted } from 'vue'

interface BindingRecord {
    id: number
    shop_id: number
    name: string
    logo: string
    amount: number | string
    aix_amount: number | string
    nft_name: string
    created_at: string
    total_income: number | string
    today_income: number | string
}

const { list, listData, loading, props: listProps, loadList } = useLoadList('/api/shop/bindings', 'bindings', null, 20)
const { props: refreshProps } = usePullRefresh(loadList)
const bindings = computed<BindingRecord[]>(() => (list.value ?? []) as BindingRecord[])
const formatDate = (value: string) => value.replace(/-/g, '.')

onMounted(loadList)
</script>

<style lang="scss" scoped>
.binding-list-page {
    min-height: 100%;
    background: #040404;
}

.binding-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 58px 30px 40px;
}

.binding-card {
    position: relative;
    flex: none;
    height: 429px;
    color: #fff;

    &__frame {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    &__flag {
        position: absolute;
        top: 0;
        right: 20px;
        width: 140px;
        height: 95px;
        border-radius: 16px;
        object-fit: cover;
    }

    &__country {
        position: absolute;
        top: 115px;
        right: 20px;
        width: 140px;
        text-align: center;
        font-size: 28px;
        line-height: 1.4;
        color: transparent;
        background: linear-gradient(90deg, #efb152, #efcd80 49.4%, #efb152);
        background-clip: text;
        -webkit-background-clip: text;
    }

    &__label {
        position: absolute;
        top: 35px;
        left: 30px;
        color: rgba(255, 255, 255, .5);
    }

    &__amount {
        position: absolute;
        top: 79px;
        left: 30px;
        gap: 10px;
        line-height: 1.25;
    }

    &__usdt {
        width: 44px;
        height: 44px;
    }

    &__amount-number {
        font-size: 48px;
    }

    &__amount-unit {
        font-size: 32px;
    }

    &__exchange {
        position: absolute;
        top: 155px;
        left: 30px;
        color: #ff2e26;
    }

    &__nft {
        position: absolute;
        top: 212px;
        left: 30px;
    }

    &__date {
        position: absolute;
        top: 211px;
        right: 30px;
        color: rgba(255, 255, 255, .5);
    }

    &__divider {
        position: absolute;
        top: 276px;
        left: 30px;
        right: 30px;
        height: 1px;
        background: rgba(255, 255, 255, .2);
    }

    &__earnings {
        position: absolute;
        top: 307px;
        left: 30px;
        right: 30px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    &__earnings-row {
        line-height: 1.4;
    }

    &__muted {
        color: rgba(255, 255, 255, .5);
    }

    &__total {
        color: #e6c333;
    }
}
</style>

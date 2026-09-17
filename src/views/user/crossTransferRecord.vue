<template>
    <CusNav :title="$t('划转记录')" :show-bg="false" :show-glass="false" />
    <CusTab v-model="current" :list="tabs" />
    <van-pull-refresh class="page rel" v-bind="refreshProps">
        <van-list v-model:loading="loading" v-model:error="error" :finished="finished" :immediate-check="false"
            :loading-text="$t('加载中...')" :finished-text="$t('没有更多了')" :error-text="$t('加载失败，点击重试')" @load="loadMore">
            <div class="pl30 pr30">
                <div v-for="item in list" :key="item.id" class="cell card mb20">
                    <div class="flex jb size28 bold record-heading">
                        <div class="counterparty">
                            {{ item.type === 1 ? $t('转给') : $t('来自') }}
                            {{ item.type === 1 ? item.to_account || '-' : item.from_account || '-' }}
                        </div>
                        <div :class="item.type === 1 ? 'red' : 'green'">
                            {{ item.type === 1 ? '-' : '+' }}{{ formatAmount(item.amount) }}
                            {{ currencyNames[item.ccy] || item.ccy }}
                        </div>
                    </div>
                    <div class="flex jb ac opc6 size24 mt20">
                        <div>{{ item.created_at }}</div>
                        <div v-if="item.type === 1" :class="statusClass(item.status)">{{ statusText(item.status) }}</div>
                    </div>
                    <div v-if="item.type === 1 && item.fail_reason" class="size24 red mt10">{{ item.fail_reason }}</div>
                </div>
                <CusEmpty v-if="!loading && !error && list.length === 0" />
            </div>
        </van-list>
    </van-pull-refresh>
</template>

<script setup lang="ts">
import BigNumber from 'bignumber.js'
import { computed, ref, watch } from 'vue'
import CusNav from '@/components/CusNav/index.vue'
import CusTab from '@/components/CusTab/index.vue'
import CusEmpty from '@/components/CusEmpty/index.vue'
import { assetAIX, assetUSDT } from '@/config'
import { t } from '@/locale'
import { apiGet } from '@/utils/request'
import { usePullRefresh } from '@/hooks/usePullRefresh'

interface CrossTransferRecord {
    id: number
    type: 1 | 2
    amount: string
    to_account?: string
    from_account?: string
    status?: 1 | 2 | 3
    fail_reason?: string
    ccy: string
    created_at: string
}

const currencyNames: Record<string, string> = { balance_usdt: assetUSDT, balance_aix: assetAIX }
const current = ref(0)
const tabs = computed(() => [
    { name: t('全部') },
    { name: t('转出') },
    { name: t('转入') }
])
const list = ref<CrossTransferRecord[]>([])
const loading = ref(false)
const error = ref(false)
const finished = ref(false)
const pageSize = 10
let nextPage = 1
let generation = 0
let pending = false
const formatAmount = (value: string) => new BigNumber(value).toFixed()
const statusText = (status?: number) => status === 1 ? t('处理中...') : status === 2 ? t('成功') : t('失败')
const statusClass = (status?: number) => status === 2 ? 'green' : status === 3 ? 'red' : ''

const loadMore = async () => {
    if (pending || finished.value) return
    const requestGeneration = generation
    pending = true
    loading.value = true
    error.value = false
    try {
        const response = await apiGet('/api/cross_transfers', {
            page_no: nextPage,
            page_size: pageSize,
            ...(current.value === 0 ? {} : { type: current.value })
        }) as unknown as { cross_transfers: CrossTransferRecord[] }
        if (requestGeneration !== generation) return
        list.value.push(...response.cross_transfers)
        nextPage += 1
        finished.value = response.cross_transfers.length < pageSize
    } catch {
        if (requestGeneration === generation) error.value = true
    } finally {
        if (requestGeneration === generation) {
            pending = false
            loading.value = false
        }
    }
}
const loadList = async () => {
    generation += 1
    pending = false
    nextPage = 1
    list.value = []
    finished.value = false
    await loadMore()
}
const { props: refreshProps } = usePullRefresh(loadList)
watch(current, loadList, { immediate: true })
</script>

<style lang="scss" scoped>
.card {
    padding: 30px;
    border-radius: 20px;
    &::before { border-radius: 20px; }
}
.record-heading { gap: 20px; flex-wrap: wrap; }
.counterparty { min-width: 0; overflow-wrap: anywhere; flex: 1; }
.page {
    width: 100vw;
    min-height: calc(100vh - 200px);
    min-height: calc(100dvh - 200px);
}
</style>

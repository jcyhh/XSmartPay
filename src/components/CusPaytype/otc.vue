<template>
    <div class="paytype flex jb ac" @click="onRowClick('bank')" v-if="showOption('bank')">
        <div class="flex ac">
            <div class="line bank mr10"></div>
            <div class="size28 bold6">银行卡</div>
        </div>
        <div class="flex ac" v-if="isBinded('bank')">
            <img src="@/assets/user/30.png" class="img32 animate__animated animate__zoomIn ani3" v-if="isSelected('bank')">
            <img src="@/assets/user/31.png" class="img32" v-else>
        </div>
        <div class="flex ac size24" v-else @click.stop="goBind('bank')">
            <div class="red">未绑定</div>
            <div class="ml10 mr10">前往绑定</div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div>
    </div>

    <div class="paytype flex jb ac" @click="onRowClick('alipay')" v-if="showOption('alipay')">
        <div class="flex ac">
            <div class="line alipay mr10"></div>
            <div class="size28 bold6">支付宝</div>
        </div>
        <div class="flex ac" v-if="isBinded('alipay')">
            <img src="@/assets/user/30.png" class="img32 animate__animated animate__zoomIn ani3" v-if="isSelected('alipay')">
            <img src="@/assets/user/31.png" class="img32" v-else>
        </div>
        <div class="flex ac size24" v-else @click.stop="goBind('alipay')">
            <div class="red">未绑定</div>
            <div class="ml10 mr10">前往绑定</div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div>
    </div>

    <div class="paytype flex jb ac" @click="onRowClick('wechat')" v-if="showOption('wechat')">
        <div class="flex ac">
            <div class="line wechat mr10"></div>
            <div class="size28 bold6">微信</div>
        </div>
        <div class="flex ac" v-if="isBinded('wechat')">
            <img src="@/assets/user/30.png" class="img32 animate__animated animate__zoomIn ani3" v-if="isSelected('wechat')">
            <img src="@/assets/user/31.png" class="img32" v-else>
        </div>
        <div class="flex ac size24" v-else @click.stop="goBind('wechat')">
            <div class="red">未绑定</div>
            <div class="ml10 mr10">前往绑定</div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onActivated, ref, watch } from 'vue'
import { apiOtcPaymentDetail } from '@/api/otc'
import { routerPush } from '@/router'

interface PaymentItem {
    id?: number | null
    type?: string | null
}

const props = withDefaults(defineProps<{
    multiple?: boolean
    // 当前场景允许使用的支付方式
    options?: string[]
}>(), {
    multiple: false,
    options: () => ['bank', 'alipay', 'wechat']
})

const emits = defineEmits(['before-bind'])

const paytype = defineModel<string | string[]>('paytype', { default: 'bank' })

const payTypeMap:Record<string, string> = {
    bank: 'bank_card',
    alipay: 'alipay',
    wechat: 'wechat'
}

const bindRouteMap:Record<string, string> = {
    bank: '/user/bind/bank',
    alipay: '/user/bind/alipay',
    wechat: '/user/bind/wechat'
}

const payTypeOrder = ['bank', 'alipay', 'wechat']
const bindedTypes = ref<string[]>([])

const selectedList = computed(() => {
    if (Array.isArray(paytype.value)) return paytype.value
    if (typeof paytype.value === 'string' && paytype.value) return [paytype.value]
    return []
})

// 仅展示允许使用的支付方式
const showOption = (value: string) => props.options.includes(value)

// 允许使用且已绑定的 api type 列表
const allowedApiTypes = computed(() => payTypeOrder
    .filter(item => props.options.includes(item))
    .map(item => payTypeMap[item]))

const isBinded = (value: string) => bindedTypes.value.includes(payTypeMap[value])
const isSelected = (value: string) => selectedList.value.includes(value)

const loadBindStatus = async () => {
    const types = allowedApiTypes.value
    if (!types.length) {
        bindedTypes.value = []
        syncPaytype()
        return
    }

    const results = await Promise.allSettled(
        types.map(type => apiOtcPaymentDetail({ type }))
    )

    bindedTypes.value = results.reduce<string[]>((list, result, index) => {
        if (result.status === 'fulfilled') {
            const payment = result.value as unknown as PaymentItem
            if (payment?.id) list.push(types[index])
        }
        return list
    }, [])

    syncPaytype()
}

const syncPaytype = () => {
    const selectable = payTypeOrder.filter(item => showOption(item) && isBinded(item))

    if (props.multiple) {
        if (!Array.isArray(paytype.value)) {
            paytype.value = selectedList.value.filter(item => selectable.includes(item))
            return
        }
        paytype.value = paytype.value.filter(item => selectable.includes(item))
        return
    }

    if (Array.isArray(paytype.value)) {
        paytype.value = paytype.value.find(item => selectable.includes(item)) || selectable[0] || ''
        return
    }

    if (paytype.value && !selectable.includes(paytype.value)) {
        paytype.value = selectable[0] || ''
    }
}

const onChoose = (value: string) => {
    if (!showOption(value) || !isBinded(value)) return

    if (props.multiple) {
        const next = [...selectedList.value]
        const index = next.indexOf(value)

        if (index > -1) {
            next.splice(index, 1)
        } else {
            next.push(value)
        }

        paytype.value = next
        return
    }

    if (paytype.value === value) return
    paytype.value = value
}

const onRowClick = (value: string) => {
    if (!showOption(value)) return
    if (!isBinded(value)) {
        goBind(value)
        return
    }
    onChoose(value)
}

const goBind = async (value: string) => {
    const path = bindRouteMap[value]
    if (!path) return

    emits('before-bind')
    await nextTick()
    routerPush(path)
}

watch(() => props.multiple, () => {
    syncPaytype()
}, { immediate: true })

watch(() => props.options, () => {
    loadBindStatus()
}, { immediate: true, deep: true })

onActivated(() => {
    loadBindStatus()
})

defineExpose({
    reload: loadBindStatus
})
</script>

<style lang="scss" scoped>
.paytype{
    height: 70px;
    .line{
        width: 4px;
        height: 18px;
        border-radius: 2px;
    }
    .bank{
        background-color: #EFB85E;
    }
    .wechat{
        background-color: #0CC76D;
    }
    .alipay{
        background-color: #019CEB;
    }
}
</style>

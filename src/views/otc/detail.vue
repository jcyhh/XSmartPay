<template>
    <CusNav :title="$t('订单详情')">
        <div class="flex je">
            <van-icon :size="24" name="chat-o" @click="routerPush(`/otc/chat/${info?.receiver_id}`)" v-if="showChatEntry" />
        </div>
    </CusNav>

    <div class="pl30 pr30 pt30 rel" v-if="info">

        <div class="inp flex jb ac size24">
            <div>{{ $t('订单状态') }}</div>
            <div :class="statusClass">{{ statusText }}</div>
        </div>

        <div class="mainCard mt30">
            <div class="flex jb ac">
                <div class="opc5">{{ isBuyer ? $t('购买总价') : $t('交易总额') }}</div>
                <div>
                    <span v-init="info.total_amount"></span>
                    <span class="ml5">CNY</span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">{{ $t('交易单价') }}</div>
                <div>
                    <span>¥</span>
                    <span v-init="info.price"></span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">{{ $t('交易数量') }}</div>
                <div>
                    <span v-init="info.num"></span>
                    <span class="ml5">{{ assetName }}</span>
                </div>
            </div>
        </div>

        <div class="mainCard mt30 pay" v-if="showPaymentInfo">
            <div class="size28">{{ isSeller ? $t('收款方式') : $t('支付方式') }}</div>
            <template v-for="payment in payments" :key="payment.type">
                <div class="flex ac mt28 mb26">
                    <div class="line" :class="payTypeClass(payment.type)"></div>
                    <div class="size26 ml10">{{ payTypeName(payment.type) }}</div>
                </div>
                <div class="flex jb ac size26">
                    <div class="opc5">{{ payment.type === 'bank_card' ? $t('持卡人姓名') : $t('真实姓名') }}</div>
                    <div>{{ payment.real_name || '--' }}</div>
                </div>
                <div class="flex jb ac size26 mt20" v-if="payment.type === 'bank_card'">
                    <div class="opc5">{{ $t('卡号') }}</div>
                    <div class="flex ac">
                        <div>{{ payment.account || '--' }}</div>
                        <img src="@/assets/otc/5.png" class="img24 ml10" v-copy="payment.account" v-if="payment.account">
                    </div>
                </div>
                <template v-else>
                    <div class="flex jb ac size26 mt20">
                        <div class="opc5">{{ $t('账号') }}</div>
                        <div class="flex ac">
                            <div>{{ payment.account || '--' }}</div>
                            <img src="@/assets/otc/5.png" class="img24 ml10" v-copy="payment.account" v-if="payment.account">
                        </div>
                    </div>
                    <div class="flex jb ast size26 mt20" v-if="payment.qr_code">
                        <div class="opc5">{{ $t('收款二维码') }}</div>
                        <img :src="payment.qr_code" class="img160 netimg" @click="previewImgs([payment.qr_code])">
                    </div>
                </template>
                <div class="flex jb ac size26 mt20" v-if="payment.type === 'bank_card' && payment.bank_name">
                    <div class="opc5">{{ $t('银行名称') }}</div>
                    <div>{{ payment.bank_name }}</div>
                </div>
                <div class="flex jb ac size26 mt20" v-if="payment.type === 'bank_card' && payment.branch_name">
                    <div class="opc5">{{ $t('开户行') }}</div>
                    <div>{{ payment.branch_name }}</div>
                </div>
            </template>
        </div>

        <div class="card mt30 flex jb ast" v-if="showPayVoucherUpload">
            <div class="flex col jb">
                <div>
                    <div class="size28">{{ $t('支付凭证') }}</div>
                    <div class="size24 opc5 mt10">{{ $t('请上传清晰的图片') }}</div>
                </div>
                <div class="size24 main">{{ $t('点击图片查看大图') }}</div>
            </div>
            <CusUpload v-model:url="payVoucher"></CusUpload>
        </div>

        <div class="card mt30 flex jb ast" v-else-if="showPayVoucherView">
            <div class="flex col jb">
                <div>
                    <div class="size28">{{ $t('支付凭证') }}</div>
                    <div class="size24 opc5 mt10">{{ $t('请核对买家上传的凭证') }}</div>
                </div>
                <div class="size24 main" @click="previewImgs([displayPayVoucher])">{{ $t('点击图片查看大图') }}</div>
            </div>
            <img :src="displayPayVoucher" class="img160 netimg" @click="previewImgs([displayPayVoucher])">
        </div>

        <div class="flex jb ac mt20" v-if="showCountdown || showAppealLink">
            <div class="flex ac" v-if="showCountdown">
                <div class="mr10 size28 red">{{ countdownLabel }}</div>
                <van-count-down :time="countdownMs">
                    <template #default="timeData">
                        <span class="red size28" v-if="timeData.days>0">{{ padZero(timeData.days) }}</span>
                        <span class="red size28" v-if="timeData.days>0">:</span>
                        <span class="red size28" v-if="timeData.hours>0">{{ padZero(timeData.hours) }}</span>
                        <span class="red size28" v-if="timeData.hours>0">:</span>
                        <span class="red size28">{{ padZero(timeData.minutes) }}</span>
                        <span class="red size28">:</span>
                        <span class="red size28">{{ padZero(timeData.seconds) }}</span>
                    </template>
                </van-count-down>
            </div>
            <div class="size24" v-if="showAppealLink">
                <span>{{ $t('对此订单有疑惑？') }}</span>
                <span class="red" @click="goAppeal">{{ $t('点击申诉') }}</span>
            </div>
        </div>

        <div class="mainCard mt30 size26" v-if="info.status==3 && info.appeal_reason">
            <div class="flex jb ac ast">
                <div class="opc5">{{ $t('申诉原因') }}</div>
                <div class="flex1 tr ml30">{{ info.appeal_reason }}</div>
            </div>
            <div class="flex jb ast mt25" v-if="info.appeal_voucher">
                <div class="opc5">{{ $t('申诉凭证') }}</div>
                <img :src="info.appeal_voucher" class="img160 netimg" @click="previewImgs([info.appeal_voucher])">
            </div>
        </div>

        <div class="mainButton mt40 btn flex jc ac main" v-if="showConfirmPayBtn" @click="showConfirm=true">{{ $t('确认已支付') }}</div>

        <div class="mainButton mt40 btn flex jc ac main" v-if="showConfirmReceiptBtn" @click="showPayConfirm=true">{{ $t('确认已收款') }}</div>

        <div class="cancelBtn flex jc ac mt30" v-if="showCancelBtn" @click="showCancel=true">{{ $t('取消订单') }}</div>

        <div class="gap100"></div>
    </div>

    <CusAsk v-model:show="showCancel" :title="$t('取消订单')" @submit="confirmCancel">
        <div class="size28">{{ $t('确认取消此订单吗？') }}</div>
    </CusAsk>

    <CusAsk v-model:show="showConfirm" :title="$t('确认已支付')" @submit="submitPay">
        <div class="size28">{{ $t('请确认已向卖家付款！') }}</div>
        <div class="size28 red mt10">{{ $t('如果恶意标记打款订单，可能会被封号处理') }}</div>
    </CusAsk>

    <CusAsk v-model:show="showPayConfirm" :title="$t('确认已收款')" @submit="submitConfirm">
        <div class="size28">{{ $t('请确认买家已向您打款！') }}</div>
    </CusAsk>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusAsk from '@/components/CusAsk/index.vue'
import CusUpload from '@/components/CusUpload/index.vue'
import { getAssetByCode } from '@/config';
import { t } from '@/locale';
import { routerGo, routerPush } from '@/router';
import { apiCancelOtcTrade, apiConfirmOtcTrade, apiOtcTradeDetail, apiPayOtcTrade } from '@/api/otc';
import { padZero, previewImgs } from '@/utils';
import { message } from '@/utils/message';
import { computed, onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const { params } = useRoute()

const POLL_INTERVAL = 3000
let pollTimer: ReturnType<typeof setInterval> | null = null

const info = ref<any>()
const payVoucher = ref('')
const showCancel = ref(false)
const showConfirm = ref(false)
const showPayConfirm = ref(false)
const submitting = ref(false)

const isBuyer = computed(() => info.value?.role === 'buyer')
const isSeller = computed(() => info.value?.role === 'seller')
const assetName = computed(() => getAssetByCode(info.value?.ccy))

const payments = computed(() => {
    const payment = info.value?.seller_payment
    if (!payment) return []
    return Array.isArray(payment) ? payment : [payment]
})

const payTypeMap:Record<string, { name:string, className:string }> = {
    bank_card: { name: t('银行卡'), className: 'bank' },
    wechat: { name: t('微信'), className: 'wechat' },
    alipay: { name: t('支付宝'), className: 'alipay' }
}

const payTypeName = (type:string) => payTypeMap[type]?.name || type
const payTypeClass = (type:string) => payTypeMap[type]?.className || ''

const statusText = computed(() => {
    const status = info.value?.status
    if (status == 0) return t('已取消')
    if (status == 1) return isBuyer.value ? t('待付款') : t('待买家付款')
    if (status == 2) return isBuyer.value ? t('待卖家确认收款') : t('待确认收款')
    if (status == 3) return t('申诉中')
    if (status == 4) return t('已完成')
    return '--'
})

const statusClass = computed(() => {
    const status = info.value?.status
    if (status == 1 || status == 2) return 'green'
    if (status == 3) return 'red'
    if (status == 4) return 'opc5'
    return 'red'
})

const showPaymentInfo = computed(() => payments.value.length > 0)

const showPayVoucherUpload = computed(() => isBuyer.value && info.value?.status == 1)

const displayPayVoucher = computed(() => info.value?.pay_voucher || payVoucher.value)

const showPayVoucherView = computed(() => {
    if (!displayPayVoucher.value) return false
    if (isBuyer.value) return info.value?.status >= 2
    return isSeller.value && info.value?.status >= 2
})

const showCountdown = computed(() => {
    const status = info.value?.status
    return (status == 1 || status == 2) && Number(info.value?.countdown) > 0
})

const countdownMs = computed(() => Number(info.value?.countdown || 0) * 1000)

const countdownLabel = computed(() => info.value?.status == 1 ? t('付款倒计时') : t('确认倒计时'))

const showAppealLink = computed(() => isSeller.value && info.value?.status == 2)

const showConfirmPayBtn = computed(() => isBuyer.value && info.value?.status == 1)

const showConfirmReceiptBtn = computed(() => isSeller.value && info.value?.status == 2)

const showCancelBtn = computed(() => isBuyer.value && info.value?.status == 1)

const isOrderEnded = (status?:number) => status === 0 || status === 4

const showChatEntry = computed(() => !!info.value?.receiver_id && !isOrderEnded(info.value?.status))

const clearPoll = () => {
    if (pollTimer) {
        clearInterval(pollTimer)
        pollTimer = null
    }
}

const syncPoll = () => {
    clearPoll()
    if (!isOrderEnded(info.value?.status)) {
        pollTimer = setInterval(() => {
            if (!submitting.value) loadData()
        }, POLL_INTERVAL)
    }
}

const loadData = async () => {
    const res:any = await apiOtcTradeDetail(params.id)
    const prevStatus = info.value?.status
    const statusChanged = prevStatus === undefined || prevStatus !== res?.status

    if (res?.pay_voucher) {
        payVoucher.value = res.pay_voucher
    }

    if (statusChanged) {
        info.value = res
    } else if (info.value) {
        Object.assign(info.value, {
            countdown: res.countdown,
            pay_voucher: res.pay_voucher,
            pay_time: res.pay_time,
            confirm_time: res.confirm_time,
            appeal_status: res.appeal_status,
            appeal_reason: res.appeal_reason,
            appeal_voucher: res.appeal_voucher,
        })
    } else {
        info.value = res
    }

    syncPoll()
}

const goAppeal = () => {
    routerPush('/otc/appeal', { id: info.value?.id })
}

const confirmCancel = async () => {
    if (!info.value?.id || submitting.value) return
    submitting.value = true
    try {
        await apiCancelOtcTrade(info.value.id)
        message(t('撤销成功'), 'success')
        showCancel.value = false
        routerGo()
    } finally {
        submitting.value = false
    }
}

const submitPay = async () => {
    if (!info.value?.id || submitting.value) return
    if (!payVoucher.value) return message(t('请上传支付凭证'))
    submitting.value = true
    try {
        await apiPayOtcTrade({
            id: info.value.id,
            pay_voucher: payVoucher.value
        })
        message(t('提交成功'), 'success')
        showConfirm.value = false
        loadData()
    } finally {
        submitting.value = false
    }
}

const submitConfirm = async () => {
    if (!info.value?.id || submitting.value) return
    submitting.value = true
    try {
        await apiConfirmOtcTrade(info.value.id)
        message(t('确认成功'), 'success')
        showPayConfirm.value = false
        loadData()
    } finally {
        submitting.value = false
    }
}

onMounted(() => {
    loadData()
})

onActivated(() => {
    if (info.value) syncPoll()
    else loadData()
})

onDeactivated(clearPoll)

onUnmounted(clearPoll)
</script>

<style lang="scss" scoped>
.card{
    background-color: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    padding: 30px;
    border-radius: 20px;
}
.btn{
    height: 88px;
    border-radius: 44px;
    font-size: 28px;
}
.cancelBtn{
    background-color: #FFFFFF1A;
    border: 1px solid #FFFFFF33;
    height: 88px;
    border-radius: 44px;
    font-size: 28px;
}
.netimg{
    object-fit: cover;
    border-radius: 16px;
}
</style>

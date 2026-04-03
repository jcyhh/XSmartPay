<template>
    <div class="flex jc ac mb60" v-if="saleCountdown.phase === 'before'">
        <div class="size24 mr20">{{ $t('今日抢购开始') }}</div>
        <van-count-down :key="`before-${saleCountdown.ms}`" :time="saleCountdown.ms" @finish="refreshSaleCountdown">
            <template #default="timeData">
                <div class="flex ac size26 bold6">
                    <div class="time flex jc ac">{{ padZero(timeData.hours) }}</div>
                    <div class="ml10 mr10">:</div>
                    <div class="time flex jc ac">{{ padZero(timeData.minutes) }}</div>
                    <div class="ml10 mr10">:</div>
                    <div class="time flex jc ac">{{ padZero(timeData.seconds) }}</div>
                </div>
            </template>
        </van-count-down>
    </div>
    <div class="flex jc ac mb60" v-else-if="saleCountdown.phase === 'during'">
        <div class="size24 mr20">{{ $t('今日抢购结束') }}</div>
        <van-count-down :key="`during-${saleCountdown.ms}`" :time="saleCountdown.ms" @finish="refreshSaleCountdown">
            <template #default="timeData">
                <div class="flex ac size26 bold6">
                    <div class="time flex jc ac">{{ padZero(timeData.hours) }}</div>
                    <div class="ml10 mr10">:</div>
                    <div class="time flex jc ac">{{ padZero(timeData.minutes) }}</div>
                    <div class="ml10 mr10">:</div>
                    <div class="time flex jc ac">{{ padZero(timeData.seconds) }}</div>
                </div>
            </template>
        </van-count-down>
    </div>
    <div class="flex jc ac mb60" v-else>
        <div class="size24 mr20">{{ $t('今日抢购已结束') }}</div>
    </div>
    <div class="flex jc">
        <div class="draw">
            <img src="@/assets/draw/2.png" class="pic2">
            <img src="@/assets/draw/3.png" class="pic3">
            <div
                class="drawRotateBox"
                :style="{
                    transform: `rotate(${drawRotate}deg)`,
                    transitionDuration: `${drawDuration}ms`,
                    transitionTimingFunction: drawTiming
                }"
            >
                <img src="@/assets/draw/4.png" class="pic4">
                <div class="drawBox">
                    <div
                        v-for="(item, index) in drawItems"
                        :key="`${item.name}-${index}`"
                        class="drawItem"
                        :style="{ transform: `rotate(${index * drawStepDeg}deg)` }"
                    >
                        <div class="drawItemContent" v-if="item.type==1">
                            <div class="drawPrice">{{ item.rush_price }}</div>
                            <div class="drawName">{{ $t('U卡') }}</div>
                        </div>
                        <div class="drawItemContent" v-else-if="item.type==2">
                            <div class="drawName">{{ $t('再来一次') }}</div>
                            <div class="flex jc mt5">
                                <img src="@/assets/draw/10.png" class="img30">
                            </div>
                        </div>
                        <div class="drawItemContent" v-else>
                            <div class="drawName">{{ $t('未中奖') }}</div>
                            <div class="flex jc mt5">
                                <img src="@/assets/draw/11.png" class="img30">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="flex jc mt60">
        <div class="btn flex jc ac" @click="submit">{{ $t('开始抢卡') }}</div>
    </div>

    <div class="tc mt30 size24 bold6">
        <span>{{ $t('消耗') }}</span>
        <span class="green ml5">{{ assetAIX }}≈</span>
        <span class="green" v-init="drawPrice"></span>
        <span class="green">{{ assetUSDT }}</span>
        <span class="ml5 mr10">{{ $t('抽一次') }}</span>
        <span>{{ $t('抽卡次数') }}</span>
        <span class="red">{{ Number(userInfo?.balance_lottery) }}</span>
    </div>

    <DrawResult ref="resultRef" @again="submit"></DrawResult>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DrawResult from './DrawResult.vue'
import { apiDraw, apiDrawConfig, apiDrawList } from '@/api/card'
import { getChinaFlashSaleCountdown, padZero } from '@/utils'
import { assetAIX, assetUSDT } from '@/config'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const resultRef = ref()

const startTime = ref('09:00')
const endTime = ref('18:00')
const drawItems = ref<any[]>([])
const saleCountdown = ref(getChinaFlashSaleCountdown(startTime.value, endTime.value))

const refreshSaleCountdown = () => {
    saleCountdown.value = getChinaFlashSaleCountdown(startTime.value, endTime.value)
}

const drawPrice = ref()
const loadPrice = async () => {
    const res:any = await apiDrawConfig()
    drawPrice.value = res.lottery_aix_price
}

const loadData = async () => {
    const res:any = await apiDrawList()
    const currentDraw = res.length > 0 ? res[0] : []
    drawItems.value = currentDraw.list
    startTime.value = currentDraw.start_time
    endTime.value = currentDraw.end_time
    refreshSaleCountdown()
}

const drawRotate = ref(0)
const drawDuration = ref(0)
const drawTiming = ref('linear')
const isDrawing = ref(false)

/** 每格角度随奖品数量变化（9 个为 40°，8 个为 45°） */
const drawStepDeg = computed(() => {
    const n = drawItems.value.length
    return n > 0 ? 360 / n : 0
})

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const submit = async () => {
    const res:any = await apiDraw()
    userStore.loadUserInfo()
    const index = drawItems.value.findIndex((item:any)=>item.id==res.rush_id)
    await draw(index)
    setTimeout(() => {
        resultRef.value?.open(res)
    }, 500);
}

const draw = async (targetIndex: number) => {
    if(isDrawing.value)return

    const count = drawItems.value.length
    if (count <= 0) return

    const step = 360 / count
    const finalIndex = ((targetIndex % count) + count) % count
    const targetBase = (360 - finalIndex * step) % 360
    const accelerateTurns = 2 * 360
    const decelerateTurns = 4 * 360

    isDrawing.value = true

    drawDuration.value = 900
    drawTiming.value = 'cubic-bezier(0.45, 0, 0.9, 0.55)'
    drawRotate.value += accelerateTurns

    await sleep(drawDuration.value)

    const currentAfterFast = ((drawRotate.value % 360) + 360) % 360
    const extraToTarget = (targetBase - currentAfterFast + 360) % 360

    drawDuration.value = 4200
    drawTiming.value = 'cubic-bezier(0.12, 0.8, 0.18, 1)'
    drawRotate.value += decelerateTurns + extraToTarget

    await sleep(drawDuration.value)

    drawDuration.value = 0
    drawTiming.value = 'linear'
    drawRotate.value = ((drawRotate.value % 360) + 360) % 360
    isDrawing.value = false
}

onMounted(() => {
    loadData()
    loadPrice()
    userStore.loadUserInfo()
})
</script>

<style lang="scss" scoped>
.draw{
    width: 660px;
    height: 660px;
    position: relative;
    .pic2{
        width: 660px;
        height: 660px;
    }
    .pic3{
        width: 250px;
        height: 366px;
        position: absolute;
        top: 35px;
        left: 205px;
        z-index: 5;
    }
    .drawRotateBox{
        width: 520px;
        height: 520px;
        position: absolute;
        top: 70px;
        left: 70px;
        z-index: 2;
        border-radius: 50%;
    }
    .pic4{
        width: 520px;
        height: 520px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
    }
    .drawBox{
        width: 520px;
        height: 520px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 4;
        border-radius: 50%;
    }
    .drawItem{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: center center;
        pointer-events: none;
    }
    .drawItemContent{
        width: 110px;
        position: absolute;
        top: 26px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        color: #FFFFFF;
        line-height: 1.15;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }
    .drawPrice{
        font-size: 32px;
        font-weight: 600;
    }
    .drawName{
        margin-top: 6px;
        font-size: 24px;
        font-weight: 600;
    }
}
.time{
    width: 40px;
    height: 40px;
    background-image: url("@/assets/draw/1.png");
    background-size: 100% 100%;
    color: #FFFFFF;
}
.btn{
    width: 400px;
    height: 100px;
    background-image: url("@/assets/draw/5.png");
    background-size: 100% 100%;
    color: #4E1F0B;
    font-size: 40px;
    font-weight: bold;
    text-shadow: 0px 1px 2px #FFFFFF;
}
</style>
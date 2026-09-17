<template>
    <div class="payBanner">
        <div class="mask"></div>
        <div class="motionStage">
            <div
                v-for="(row, rowIndex) in cardRows"
                :key="rowIndex"
                class="motionRow"
                :class="rowIndex % 2 === 0 ? 'rowLeft' : 'rowRight'"
                :style="{ animationDuration: `${20 + rowIndex * 2}s` }"
            >
                <div
                    v-for="(item, itemIndex) in [...row, ...row]"
                    :key="`${rowIndex}-${itemIndex}-${item}`"
                    class="motionItem"
                >
                    <img :src="item" class="cardImg">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import card1 from '@/assets/card/1.webp'
import card2 from '@/assets/card/2.webp'
import card3 from '@/assets/card/3.webp'
import card4 from '@/assets/card/4.webp'
import card5 from '@/assets/card/5.webp'
import card6 from '@/assets/card/6.webp'
import card7 from '@/assets/card/7.webp'

const cardRows = [
    [card1, card2, card3, card4, card5],
    [card6, card7, card1, card3, card2],
    [card4, card5, card6, card7, card1]
]
</script>

<style lang="scss" scoped>
.payBanner{
    width: 100vw;
    height: 1031px;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    pointer-events: none;
    &::before{
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.35) 100%);
        z-index: 1;
    }
    &::after{
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, transparent 38%, rgba(0, 0, 0, 0.4) 100%);
        z-index: 1;
    }
}
.mask{
    width: 100vw;
    height: 1031px;
    background: linear-gradient(rgba(0,0,0,0,), rgba(0,0,0,1));
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}
.motionStage{
    width: 1600px;
    position: absolute;
    top: 80px;
    left: -260px;
    display: flex;
    flex-direction: column;
    gap: 36px;
    transform: rotate(-16deg) scale(1.08);
    transform-origin: center top;
}
.motionRow{
    width: max-content;
    display: flex;
    gap: 34px;
    will-change: transform;
}
.rowLeft{
    animation: row-left linear infinite;
}
.rowRight{
    animation: row-right linear infinite;
}
.motionItem{
    width: 308px;
    height: 185px;
    flex-shrink: 0;
    border-radius: 22px;
    overflow: hidden;
    opacity: 0.9;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
}
.cardImg{
    width: 100%;
    height: 100%;
    display: block;
}
@keyframes row-left {
    from {
        transform: translate3d(0, 0, 0);
    }
    to {
        transform: translate3d(-50%, 0, 0);
    }
}
@keyframes row-right {
    from {
        transform: translate3d(-50%, 0, 0);
    }
    to {
        transform: translate3d(0, 0, 0);
    }
}
</style>

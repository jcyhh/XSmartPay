<template>
    <div class="banner">
        <div class="track">
            <div v-for="(item, index) in renderCards" :key="`${item}-${index}`" class="card">
                <img :src="item" class="cardImg">
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

const cards = [card1, card2, card3, card4, card5, card6, card7]
const renderCards = [...cards, ...cards]
</script>

<style lang="scss" scoped>
.banner{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.track{
    width: max-content;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 20px;
    animation: marquee-left 18s linear infinite;
    will-change: transform;
}
.card{
    width: 200px;
    height: 120px;
    flex-shrink: 0;
    border-radius: 14px;
    overflow: hidden;
}
.cardImg{
    width: 100%;
    height: 100%;
    display: block;
}
@keyframes marquee-left {
    from {
        transform: translate3d(0, 0, 0);
    }
    to {
        transform: translate3d(calc(-50% - 10px), 0, 0);
    }
}
</style>

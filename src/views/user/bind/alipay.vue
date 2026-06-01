<template>
    <CusNav :title="$t('支付宝')"></CusNav>
    <div class="pl30 pr30 pt30 rel">
        
        <div class="cell flex ac">
            <input type="email" v-model="name" :placeholder="$t('钱包地址')" class="flex1 size28">
        </div>

        <div class="mainBtn mt60 flex jc ac size28 bold5" @click="submit">{{ $t('确认') }}</div>

    </div>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { ref } from 'vue';

const name = ref()

const submit = () => {
    
}
</script>

<style lang="scss" scoped>
.cell{
    background: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    padding: 0 30px;
    height: 88px;
    border-radius: 14px;
}
</style>
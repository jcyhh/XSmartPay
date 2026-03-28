<template>
    <div class="cell flex ac">
        <input type="password" v-model="password" :placeholder="tips" class="flex1 size28" v-show="!show">
        <input type="text" v-model="password" :placeholder="tips" class="flex1 size28" v-show="show">
        <img src="@/assets/login/eyeOpen.png" class="img30 animate__animated animate__zoomIn ani5" @click="show=false" v-if="show">
        <img src="@/assets/login/eyeClose.png" class="img30" @click="show=true" v-else>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps(['tips'])

const show = ref(false)

const password = defineModel<string>({ default: '' })
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
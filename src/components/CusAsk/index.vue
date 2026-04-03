<template>
    <VanPopup v-model:show="show" style="background: transparent;" overlay-class="cusMask" teleport="#app">
        <div class="popupCenter mainCard">
            <div class="content">
                <div class="flex jb ac">
                    <div class="size28 main bold6">{{ title }}</div>
                    <van-icon size="20" name="cross" color="#8D9094" @click="show=false" />
                </div>

                <div class="size26 mt50">
                    <slot></slot>
                </div>

                <div class="mt50 flex ac bold5">
                    <div class="mainButton btn flex jc ac main" @click="show=false">{{ $t('取消') }}</div>
                    <div class="mainBtn btn ml20 flex jc ac" @click="emits('submit')">{{ $t('确认') }}</div>
                </div>
            </div>
        </div>
    </VanPopup>
</template>

<script setup lang="ts">
import { t } from '@/locale';

defineProps({
    title: {
        type: String,
        default: t('提示')
    }
})
const emits = defineEmits(['submit'])
const show = defineModel<boolean>('show', { default: false })
</script>

<style lang="scss" scoped>
.btn{
    flex: 1;
    height: 68px;
    border-radius: 34px;
}
</style>
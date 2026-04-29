<template>
    <VanPopup v-model:show="show" style="background: transparent;" :close-on-click-overlay="false" overlay-class="cusMask" teleport="#app">
        <div class="popupCenter mainCard">
            <div class="content">
                <div class="flex jb ac">
                    <div class="size28 main bold6">{{ $t('理财档位') }}</div>
                </div>

                <div class="cell mt40 flex jb ac" @click="showPicker=true">
                    <div>{{ list[current].name }}</div>
                    <van-icon name="arrow" />
                </div>

                <div class="size24 mt20">
                    <span class="opc6">充值时缴纳充值额</span>
                    <span class="main ml5 mr5">{{ list[current].rate1 }}%</span>
                    <span class="opc6">服务费</span>
                </div>
                <div class="size24 mt20">
                    <span class="opc6">享受充值额</span>
                    <span class="main ml5 mr5">{{ list[current].rate2 }}%</span>
                    <span class="opc6">等值的AIX释放权益</span>
                </div>

                <div class="mt50 flex ac bold5">
                    <div class="mainBtn flex1 btn flex jc ac" @click="submit">{{ $t('确认') }}</div>
                </div>
            </div>
        </div>
    </VanPopup>

    <CusPicker v-model:show="showPicker" :list="list" :title="$t('请选择')" :default-index="current" @change="$event=>current=$event">
        <template v-slot="{ item }">
            <span class="bold5">{{ item.name }}</span>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import CusPicker from '@/components/CusPicker/index.vue';
import { t } from '@/locale';
import { computed, ref } from 'vue';

const showPicker = ref(false)

const show = defineModel<boolean>('show', { default: false })

const current = ref(0)

const list = computed(()=>([
    {name:t('基础档'), rate1: 5, rate2: 15},
    {name:t('默认档'), rate1: 15, rate2: 50},
    {name:t('尊享档'), rate1: 30, rate2: 100}
]))

const submit = () => {

}
</script>

<style lang="scss" scoped>

</style>
<template>
    <CusPicker v-model:show="show" :list="langs" :title="$t('切换语言')" :default-index="current" @change="onChange">
        <template v-slot="{ item }">
            <span class="bold5">{{ item.name }}</span>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CusPicker from '@/components/CusPicker/index.vue';
import { langs } from '@/locale'
import { useAppStore } from '@/store';
import { storeToRefs } from 'pinia';

const useStore = useAppStore()
const { lang } = storeToRefs(useStore)

const current = ref(0)
const show = defineModel<boolean>('show', { default: false })
watch(show, (value) => {
    if(value)current.value = langs.findIndex(item => item.lang === lang.value)
})

const onChange = (index: number) => {
    current.value = index
    useStore.setLocale(langs[index].lang)
}
</script>

<style lang="scss" scoped>

</style>
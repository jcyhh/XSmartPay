<template>
    <RouterView v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" />
    </RouterView>

    <CusLoading v-model="loading"></CusLoading>
</template>

<script setup lang="ts">
import CusLoading from '@/components/CusLoading/index.vue'
import { storeToRefs } from 'pinia';
import { useAppStore } from './store';

const dappStore = useAppStore()
const { loading } = storeToRefs(dappStore)
</script>

<style scoped></style>

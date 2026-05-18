<template>
    <div class="cusTab size28 bold6">
        <div class="cusTabScroll flex ac">
            <div
                v-for="(item, index) in list"
                :key="index"
                :ref="(el:any) => setItemRef(el, index)"
                class="cusTabBox"
                :class="{
                    'main cusTabAct': current == index,
                    'opc5 cusTabDef': current != index,
                    'ml20': Number(index) > 0
                }"
                @click="onTabClick(index)"
            >
                {{ item.name }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, watch } from 'vue'

const props = withDefaults(defineProps<{
    list?: any[]
}>(), {
    list: () => []
})

const current = defineModel<number>({ default: 0 })

const itemRefs: HTMLElement[] = []

const setItemRef = (el: Element | null, index: number) => {
    if (!el) return
    itemRefs[index] = el as HTMLElement
}

const scrollActiveTabIntoView = async () => {
    await nextTick()
    const currentEl = itemRefs[current.value]
    currentEl?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
    })
}

const onTabClick = (index: any) => {
    const cur = Number(index)
    if (current.value == cur) return
    current.value = cur
}

watch(() => current.value, () => {
    scrollActiveTabIntoView()
}, { immediate: true })

watch(() => props.list?.length, () => {
    itemRefs.length = 0
    scrollActiveTabIntoView()
})
</script>

<style lang="scss" scoped>
.cusTab{
    width: 100vw;
    height: 150px;
    background-color: #040404;
    position: sticky;
    top: 100px;
    left: 0;
    z-index: 5;
    overflow: hidden;
}

.cusTabScroll{
    width: 100%;
    height: 100%;
    padding: 0 30px;
    box-sizing: border-box;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar{
        display: none;
    }
}

.cusTabBox{
    height: 80px;
    min-width: max-content;
    padding: 0 24px;
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    border: 1px solid transparent;
    position: relative;
    white-space: nowrap;
    &::before{
        content: '';
        position: absolute;
        z-index: -1;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border-radius: 10px;
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: xor;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        padding: 1px;
    }
}

.cusTabAct{
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%);
    &::before{
        background: linear-gradient(360deg, #FFE5A5 0%, rgba(255, 229, 165, 0.1) 100%);
    }
}

.cusTabDef{
    background: linear-gradient(180deg, rgba(255, 229, 165, 0.12) 0%, rgba(255, 229, 165, 0.04) 100%);
    &::before{
        background: linear-gradient(360deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
    }
}
</style>

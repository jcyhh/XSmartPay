<template>
    <div class="cusTab flex ac size28 bold6">
        <div class="cusTabBox" :class="{
            'main cusTabAct': current==index,
            'opc5 cusTabDef': current!=index,
            'ml20': Number(index) > 0
        }" v-for="(item, index) in list" :key="index" @click="onTabClick(index)">{{ item.name }}</div>
    </div>
</template>

<script setup lang="ts">
defineProps(['list'])
const emits = defineEmits(['change'])
const current = defineModel<number>({ default: 0 })

const onTabClick = (index:any) => {
    const cur = Number(index)
    if(current.value == cur)return
    current.value = cur
    emits('change')
}
</script>

<style lang="scss" scoped>
.cusTab{
    width: 100vw;
    height: 150px;
    padding: 0 30px;
    background-color: #040404;
    position: sticky;
    top: 100px;
    left: 0;
    z-index: 5;
    .cusTabBox{
        height: 80px;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        border: 1px solid transparent;
        position: relative;
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
}
</style>
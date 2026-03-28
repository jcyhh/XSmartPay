<template>
    <VanPopup v-model:show="show" style="background: transparent;" :destroy-on-close="true" position="bottom" overlay-class="cusMask" teleport="#app">
        <div class="picker">
            <div class="flex jb ac mb60">
                <div class="size32 main bold5">{{ title }}</div>
                <van-icon size="20" name="cross" color="#8D9094" @click="close" />
            </div>
            <CusEmpty v-if="list.length==0"></CusEmpty>
            <div v-else>
                <swiper slidesPerView="auto" :centeredSlides="true" direction="vertical" space-between="10" @swiper="onSwiper" @slide-change="slideChange">
                    <swiper-slide v-for="(item, index) in list" :key="index" @click="slideClick(index)">
                        <slot :item="item"></slot>
                    </swiper-slide>
                </swiper>
            </div>
            <div class="mt60">
                <div class="mainBtn flex jc ac bold5 size30" @click="submit">{{ submitTxt }}</div>
            </div>
            <div class="safeBottom"></div>
        </div>
    </VanPopup>
</template>

<script setup lang="ts">
import { computed, ref, type PropType, watch } from 'vue';
import CusEmpty from '@/components/CusEmpty/index.vue';
import { t } from '@/locale';
import { Swiper, SwiperSlide } from 'swiper/vue';
// @ts-ignore
// https://swiperjs.com/demos
import 'swiper/css';

const emit = defineEmits(['change', 'update:show'])
const props = defineProps({
    show: { // 弹窗显隐
        type: Boolean,
        default: false
    },
    list: { // 列表
        type: Array as PropType<any[]>,
        default: ():any[] => []
    },
    defaultIndex: { // 默认选中
        type: Number,
        default: 0
    },
    title: { // 标题
        type: String,
        default: t('请选择')
    },
    name: { // 显示字段
        type: String,
        default: 'name'
    },
    submitTxt: { // 确认按钮文字
        type: String,
        default: t('确定')
    }
})

const show = computed({
    get: () => props.show,
    set: (value: boolean) => emit('update:show', value)
})
const open = async (index:number) => {
    show.value = true
    current.value = index
}
const close = () => show.value = false

const current = ref(props.defaultIndex)
const mySwiper = ref()
const onSwiper = (swiper: any) => {
    mySwiper.value = swiper
    mySwiper.value.slideTo(current.value)
}
watch(() => props.defaultIndex, (value) => {
    current.value = value
    if(mySwiper.value)mySwiper.value.slideTo(current.value)
})
watch(() => props.show, (value) => {
    if(value && mySwiper.value)mySwiper.value.slideTo(current.value)
})
const slideChange = (data: any) => current.value = data.activeIndex

const slideClick = (index:number) => mySwiper.value.slideTo(index)

const submit = ()=> {
    close()
    emit('change', current.value)
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
.picker{
    border-radius: 40px 40px 0 0;
    padding: 40px;
    background: linear-gradient(#322F27, #000000);
    .swiper {
        width: 670px;
        height: 500px;
    }

    .swiper-slide {
        width: 670px;
        height: 80px;
        border-radius: 20px;
        text-align: center;
        line-height: 80px;
        font-size: 28px;
        opacity: 0.5;
    }

    .swiper-slide-active {
        background-color: #FFE5A51F;
        opacity: 1;
    }
}
</style>
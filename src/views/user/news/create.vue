<template>
    <CusNav :title="$t('发帖')"></CusNav>
    <div class="pl30 pr30 pt30 rel">
        
        <div class="size28 bold6">{{ $t('标题') }}</div>
        <div class="cell card mb20 flex jb ac mt20">
            <input type="text" v-model="title" :placeholder="$t('请输入标题')" class="flex1 size28">
        </div>

        <div class="size28 bold6 mt30">{{ $t('内容') }}</div>
        <div class="cell card mb20 flex jb ac mt20">
            <textarea v-model="content" :placeholder="$t('请输入内容')" class="size28 area"></textarea>
        </div>

        <div class="size28 bold6 mt30">{{ $t('图片(选填 {count}/9)', { count: images.length }) }}</div>
        <div class="grid col3 imgs mt20">
            <img :src="item" class="pic" v-for="(item,index) in images" :key="index" @click="upload(index)">
            <div class="cell pic flex jc ac" @click="upload(-1)">
                <van-icon name="plus" :size="40" />
            </div>
        </div>

        <div class="mainButton mt80 flex jc ac size28 main bold6 btn" v-scale @click="submit">{{ $t('发布') }}</div>

    </div>

    <div class="gap30"></div>
</template>

<script setup lang="ts">
import { apiCommentCreate } from '@/api/comment';
import CusNav from '@/components/CusNav/index.vue'
import { t } from '@/locale';
import { routerGo } from '@/router';
import { message } from '@/utils/message';
import { apiUpload } from '@/utils/request';
import { ref } from 'vue';

const title = ref()
const images = ref<string[]>([])
const content = ref()

const upload = async (index:any) => {
    const res:any = await apiUpload()
    if (index >= 0) {
        images.value.splice(index, 1, res.url)
    } else if (images.value.length < 9) {
        images.value.push(res.url)
    }
}

const submit = async () => {
    if(!title.value)return message(t('请输入标题'))
    if(!content.value)return message(t('请输入内容'))
    await apiCommentCreate({
        title: title.value,
        content: content.value,
        images: images.value
    })
    message(t('发布成功'), 'success')
    routerGo()
}
</script>

<style lang="scss" scoped>
.card{
    border-radius: 20px;
    padding: 30px;
    &::before{
        border-radius: 20px;
    }
}
.bottom{
    width: 100vw;
    padding: 20px 30px 30px 30px;
    background-color: #040404;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
}
.area{
    background-color: transparent;
    border: none;
    height: 300px;
    width: 100%;
    resize: none;
}
.imgs{
    gap: 15px;
}
.pic{
    width: 215px;
    height: 215px;
    border-radius: 16px;
}
.btn{
    height: 88px;
    border-radius: 44px;
}
</style>
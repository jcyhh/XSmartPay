<template>
    <VanPopup v-model:show="show" style="background: transparent;" position="bottom" overlay-class="cusMask" teleport="#app">
        <div class="popup">
            <div class="content">
                <div class="flex jb ac">
                    <div class="size28 main bold6">{{ $t('评论') }}</div>
                    <van-icon size="20" name="cross" color="#8D9094" @click="show=false" />
                </div>

                 <div class="size26 mt60">{{ $t('图片(选填 {count}/9)', { count: images.length }) }}</div>
                <div class="grid col3 imgs mt20">
                    <img :src="item" class="pic" v-for="(item,index) in images" :key="index" @click="upload(index)">
                    <div class="cell pic flex jc ac" @click="upload(-1)">
                        <van-icon name="plus" :size="40" />
                    </div>
                </div>
                <div class="size26 mt30">{{ $t('内容') }}</div>
                <div class="area mt30">
                    <textarea v-model="content" :maxlength="40" :placeholder="$t('请输入评论内容')" class="size28 areainp" />
                    <div class="tr size24 opc5">{{ content.length }}/40</div>
                </div>

                <div class="mainButton mt40 flex jc ac size28 main bold6 btn" v-scale @click="submit">{{ $t('发布评论') }}</div>
                <div class="safeArea"></div>
            </div>
        </div>
    </VanPopup>
</template>

<script setup lang="ts">
import { apiCommentJudge } from '@/api/comment';
import { t } from '@/locale';
import { message } from '@/utils/message';
import { apiUpload } from '@/utils/request';
import { ref, watch } from 'vue';

const props = defineProps(['id'])

const emits = defineEmits(['success'])

const show = defineModel<boolean>('show', { default: false })

const images = ref<string[]>([])
const content = ref()

watch(show, () => {
    images.value = []
    content.value = ''
})

const upload = async (index:any) => {
    const res:any = await apiUpload()
    if (index >= 0) {
        images.value.splice(index, 1, res.url)
    } else if (images.value.length < 9) {
        images.value.push(res.url)
    }
}

const submit = async () => {
    if(!content.value)return message(t('请输入评论内容'))
    await apiCommentJudge({
        content: content.value,
        images: images.value,
        parent_id: 0,
        post_id: props.id
    })
    show.value = false
    message(t('评论成功'), 'success')
    emits('success')
}
</script>

<style lang="scss" scoped>
.btn{
    height: 88px;
    border-radius: 44px;
}
.upload{
    width: 200px;
    height: 200px;
    border-radius: 16px;
    object-fit: cover;
}
.inp{
    height: 90px;
    background-color: #FFE5A51F;
    border-radius: 14px;
    padding: 0 30px;
    border: 1px solid #FFFFFF1A;
}
.area{
    padding: 30px;
    background-color: #FFE5A51F;
    border-radius: 14px;
    border: 1px solid #FFFFFF1A;
    .areainp{
        background-color: transparent;
        border: none;
        height: 200px;
        width: 100%;
        resize: none;
    }
}
.pic{
    width: 215px;
    height: 215px;
    border-radius: 16px;
}
</style>
<template>
    <CusNav :title="$t('申诉')"></CusNav>

    <div class="pl30 pr30 pt30 rel">
        
        <div class="card">
            <textarea placeholder="请输入本次申请原因" v-model="remark" class="area"></textarea>
            <div class="size24 opc5 mt30">{{ remark.length }}/200 字</div>
        </div>

        <div class="card mt30 flex jb ast">
            <div class="flex col jb">
                <div>
                    <div class="size28">支付凭证</div>
                    <div class="size24 opc5 mt10">请上传清晰的图片</div>
                </div>
            </div>
            <div>
                <img src="@/assets/otc/6.png" class="img160">
            </div>
        </div>

    </div>

    <div class="safeArea"></div>
    <div class="gap130"></div>
    <div class="bottom">
        <div class="mainBtn size28 bold6 flex jc ac" @click="submit">{{ $t('提交') }}</div>
        <div class="safeArea"></div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const remark = ref('')

const submit = () => {
    
}
</script>

<style lang="scss" scoped>
.card{
    background-color: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    padding: 30px;
    border-radius: 20px;
    .area{
        width: 100%;
        height: 300px;
        background: transparent;
        border: none;
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
</style>
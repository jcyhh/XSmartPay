<template>
    <VanPopup v-model:show="show" style="background: transparent;" position="bottom" overlay-class="cusMask" teleport="#app">
        <div class="popup">
            <div class="content">
                <div class="flex jb ac">
                    <div class="size36 bold6">{{ $t('购买') }} {{ assetUSDT }}</div>
                    <van-icon size="20" name="cross" color="#8D9094" @click="show=false" />
                </div>

                <div class="size24 mt16">
                    <span class="opc5">单价</span>
                    <span class="ml10 mr5 main">¥</span>
                    <span class="main" v-init="1000"></span>
                </div>

                <div class="flex mt30">
                    <div class="tabitem" :class="current==0?'':'opc5'" @click="onTabChange(0)">
                        <span>按金额购买</span>
                        <div class="line animate__animated animate__zoomIn ani3" v-if="current==0"></div>
                    </div>
                    <div class="tabitem ml40" :class="current==1?'':'opc5'" @click="onTabChange(1)">
                        <span>按数量购买</span>
                        <div class="line animate__animated animate__zoomIn ani3" v-if="current==1"></div>
                    </div>
                </div>

                <div class="inp flex jb ac mt20 size28">
                    <input type="password" v-model="inputAmount" :placeholder="$t('请输入购买金额')" class="flex1">
                    <div class="size26">CNY</div>
                </div>

                <div class="size24 opc5 mt30">
                    <span>限额 : </span>
                    <span v-init="1000"></span>
                    <span class="ml5">CNY</span>
                    <span class="ml5 mr5">-</span>
                    <span v-init="1000"></span>
                    <span class="ml5">CNY</span>
                </div>

                <div class="flex jb ac mt40 size26">
                    <div class="opc5">交易数量</div>
                    <div>
                        <span v-init="1000"></span>
                        <span class="ml5">CNY</span>
                    </div>
                </div>

                <div class="flex jb ac mt20 size26">
                    <div class="opc5">交易总额</div>
                    <div>
                        <span class="mr5">¥</span>
                        <span v-init="1000"></span>
                    </div>
                </div>

                <div class="gap200"></div>

                <div class="mainBtn mt100 flex jc ac size28 main bold6 btn" @click="submit">{{ $t('确认购买') }}</div>

                <div class="safeArea"></div>
            </div>
        </div>
    </VanPopup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from '@/utils/message';
import { t } from '@/locale';
import { assetUSDT } from '@/config';

const emits = defineEmits(['success'])

const current = ref(0)
const onTabChange = (index:number) => {
    if(current.value == index)return
    current.value = index
}

const show = ref(false)

// 打开弹窗
const info = ref()
const open = (data:any) => {
    current.value = 0
    info.value = data
    show.value = true
}

const inputAmount = ref()
const submit = async () => {
    
    message(t('激活成功'), 'success')
    emits('success')
    show.value = false
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
.inp{
    height: 90px;
    padding: 0 30px;
    background-color: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    border-radius: 14px;
    .line{
        width: 1px;
        height: 44px;
        background-color: #FFFFFF33;
    }
}
.tabitem{
    height: 90px;
    position: relative;
    font-size: 28px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    .line{
        width: 40%;
        height: 4px;
        border-radius: 2px;
        background-color: #FFE5A5;
        position: absolute;
        bottom: 16px;
    }
}
</style>
<template>
    <div class="flex col ac" v-if="forms.length==0">
        <CusEmpty></CusEmpty>
        <van-loading />
    </div>
    <div v-else>
        
        <div v-for="(item,index) in forms" :key="index">
            <div v-if="item.key != 'amount' && item.key != 'channel_code' && item.key != 'currency_code' && item.key != 'channel_issue_code' && item.key != 'purpose'">
                <div class="mt30 size26 bold5">
                    <span class="red">*</span>
                    <span>{{ item.description }}</span>
                </div>
                <div class="cell mt20 flex jb ac size28">
                    <input type="text" v-model="item.value" class="flex1" :placeholder="$t('请输入')">
                </div>
            </div>
        </div>

        <div class="flex mt80 size28 bold6">
            <div class="flex1 lineBtn flex jc ac" @click="submitPrev">{{ $t('上一步') }}</div>
            <div class="flex1 mainBtn flex jc ac ml20" @click="submit">{{ $t('下一步') }}</div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CusEmpty from '@/components/CusEmpty/index.vue'
import { message } from '@/utils/message';
import { t } from '@/locale';

const props = defineProps(['fields'])
const emits = defineEmits(['nextStep', 'prevStep'])

const forms = ref<any[]>([])

watch(()=>props.fields,val => {
    if (val && val.length > 0) {
        forms.value = val.map((item:any)=>{
            return {
                ...item,
                ...{ value: item.value || '' }
            }
        })
    }
}, {immediate:true})

const submitPrev = () => emits('prevStep')

const submit = () => {
    for (let i=0;i<forms.value.length;i++) {
        if(!forms.value[i].value){
            return message(t('请补全收款人信息'))
        }
    }
    emits('nextStep', forms.value)
}
</script>

<style lang="scss" scoped>
.cell{
    background: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    padding: 0 30px;
    height: 88px;
    border-radius: 14px;
    .line{
        width: 1px;
        height: 44px;
        background-color: #FFFFFF1A;
    }
}
.lineBtn{
    height: 74px;
    border-radius: 37px;
    color: $main-color;
    font-size: 28px;
    border: 1px solid $main-color;
}
</style>
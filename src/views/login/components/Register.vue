<template>
    <div>
        <div class="cell flex ac">
            <input type="email" v-model="email" :placeholder="$t('邮箱')" class="flex1 size28">
        </div>

        <div class="cell flex ac mt30 mb30">
            <input type="text" v-model="emailCode" :placeholder="$t('验证码')" class="flex1 size28">
            <div class="size28 main flex0">
                <CusSms :account="email" type="1"></CusSms>
            </div>
        </div>

        <Password v-model="password" :tips="$t('密码')"></Password>

        <div class="gap30"></div>

        <Password v-model="pay_password" :tips="$t('支付密码')"></Password>

        <div class="cell flex ac mt30">
            <input type="text" v-model="refCode" :placeholder="$t('邀请码')" class="flex1 size28">
        </div>

        <div class="mainBtn mt60 flex jc ac size28 bold5" @click="submit">{{ $t('注册') }}</div>

        <div class="flex jc mt20">
            <div class="size24 main" @click="download">{{ $t('已注册？下载APP') }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CusSms from '@/components/CusSms/index.vue'
import { ref } from 'vue';
import Password from './Password.vue';
import { getRef, setAccount } from '@/config/storage';
import { apiRegister } from '@/api/login';
import { message } from '@/utils/message';
import { t } from '@/locale';
import { apiVersion } from '@/api/user';
import { isIOS, openLink } from '@/utils';

const props = defineProps(['type'])

const emits = defineEmits(['change'])

const email = ref()
const password = ref()
const emailCode = ref()
const refCode = ref()
const pay_password = ref()

const storage = getRef()
if(storage)refCode.value = storage

const download_url = ref()
const loadData = async () => {
    const res:any = await apiVersion({
        version: '1.0.0',
        device: isIOS() ? 'ios' : 'android'
    })
    download_url.value = res.download_url
}
loadData()

const download = () => {
    openLink(download_url.value)
}

const submit = async () => {
    if(!email.value)return message(t('请输入邮箱'))
    if(!emailCode.value)return message(t('请输入验证码'))
    if(!password.value)return message(t('请设置登录密码'))
    if(!pay_password.value)return message(t('请设置支付密码'))
    await apiRegister({
        email: email.value,
        password: password.value,
        email_code: emailCode.value,
        pay_password: pay_password.value,
        ref: refCode.value
    })
    setAccount(email.value)
    message(t('注册成功'), 'success')
    if(props?.type){
        download()
    }else{
        emits('change')
    }
}
</script>

<style lang="scss" scoped>
.cell{
    background: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    padding: 0 30px;
    height: 88px;
    border-radius: 14px;
}
</style>
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

        <div class="cell flex ac mt30">
            <input type="text" v-model="refCode" :placeholder="$t('邀请码')" class="flex1 size28">
        </div>

        <div class="mainBtn mt60 flex jc ac size28 bold5" @click="submit">{{ $t('注册') }}</div>
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

const emits = defineEmits(['change'])

const email = ref()
const password = ref()
const emailCode = ref()
const refCode = ref()

const storage = getRef()
if(storage)refCode.value = storage

const submit = async () => {
    await apiRegister({
        email: email.value,
        password: password.value,
        email_code: emailCode.value,
        ref: refCode.value
    })
    setAccount(email.value)
    message(t('注册成功'), 'success')
    emits('change')

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
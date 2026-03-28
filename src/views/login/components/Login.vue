<template>
    <div>
        <div class="cell flex ac mb30">
            <input type="email" v-model="email" :placeholder="$t('邮箱账号')" class="flex1 size28">
        </div>

        <Password v-model="password" :tips="$t('密码')"></Password>

        <div class="flex je mt16">
            <div class="size24 grey" @click="routerPush('/forget')">{{ $t('忘记密码') }}?</div>
        </div>

        <div class="mainBtn mt60 flex jc ac size28 bold5" @click="submit">{{ $t('登录') }}</div>
    </div>
</template>

<script setup lang="ts">
import { apiLogin } from '@/api/login';
import { getAccount, setAccount, setToken } from '@/config/storage';
import { t } from '@/locale';
import { routerPush, routerReplace } from '@/router';
import { message } from '@/utils/message';
import { ref } from 'vue';
import Password from './Password.vue';

const email = ref()
const password = ref()

const storageAccount = getAccount()
if(storageAccount)email.value = storageAccount

const submit = async () => {
    if(!email.value)return message(t('请输入邮箱账号'))
    if(!password.value)return message(t('请输入账号密码'))

    const res:any = await apiLogin({
        email: email.value,
        password: password.value
    })

    setToken(res.token)
    setAccount(email.value)

    routerReplace('/home')
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
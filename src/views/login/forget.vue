<template>
    <CusNav :title="$t('忘记密码')"></CusNav>
    <div class="pl30 pr30 pt30 rel">
        
        <div class="cell flex ac">
            <input type="email" v-model="email" :placeholder="$t('邮箱')" class="flex1 size28">
        </div>

        <div class="cell flex ac mt30 mb30">
            <input type="text" v-model="emailCode" :placeholder="$t('验证码')" class="flex1 size28">
            <div class="size28 main flex0">
                <CusSms :account="email" type="3"></CusSms>
            </div>
        </div>

        <Password v-model="password" :tips="$t('新密码')"></Password>

        <div class="gap30"></div>

        <Password v-model="passwordAgain" :tips="$t('确认密码')"></Password>

        <div class="mainBtn mt60 flex jc ac size28 bold5" @click="submit">{{ $t('确认') }}</div>

    </div>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import Password from './components/Password.vue';
import { ref } from 'vue';
import { message } from '@/utils/message';
import { t } from '@/locale';
import { apiForgetPassword } from '@/api/login';
import { routerReplace } from '@/router';
import { setAccount } from '@/config/storage';

const email = ref()
const password = ref()
const passwordAgain = ref()
const emailCode = ref()

const submit = async () => {
    if(!email.value)return message(t('请输入邮箱'))
    if(!emailCode.value)return message(t('请输入验证码'))
    if(!password.value)return message(t('请输入新密码'))
    if(!passwordAgain.value)return message(t('请再次输入密码'))
    if(password.value != passwordAgain.value)return message(t('密码输入不一致'))

    await apiForgetPassword({
        email: email.value,
        password: password.value,
        email_code: emailCode.value
    })

    setAccount(email.value)

    message(t('修改成功'))
    routerReplace('/login')
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
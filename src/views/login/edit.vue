<template>
    <CusNav :title="$t('修改密码')"></CusNav>
    <div class="pl30 pr30 pt30 rel">

        <div class="cell flex jb ac mt30 mb30">
            <div>{{ $t('邮箱') }}</div>
            <div class="size28 main flex0" v-init:address="userInfo?.email"></div>
        </div>

        <div class="cell flex ac mt30 mb30">
            <input type="text" v-model="email_code" :placeholder="$t('验证码')" class="flex1 size28">
            <div class="size28 main flex0">
                <CusSms :account="userInfo?.email" type="6"></CusSms>
            </div>
        </div>

        <Password v-model="n_password" :tips="$t('新密码')"></Password>

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
import { apiEditPassword } from '@/api/login';
import { routerReplace } from '@/router';
import { useUserStore } from '@/store/index.ts';
import { storeToRefs } from 'pinia';
import CusSms from '@/components/CusSms/index.vue'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const n_password = ref()
const passwordAgain = ref()
const email_code = ref()

const submit = async () => {
    if(!email_code.value)return message(t('请输入验证码'))
    if(!n_password.value)return message(t('请输入新密码'))
    if(!passwordAgain.value)return message(t('请再次输入新密码'))
    if(passwordAgain.value != n_password.value)return message(t('新密码输入不一致'))

    await apiEditPassword({
        n_password: n_password.value,
        email_code: email_code.value,
        type: 1
    })

    message(t('修改成功请重新登录'), 'success')
    setTimeout(() => routerReplace('/login'), 1200);
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
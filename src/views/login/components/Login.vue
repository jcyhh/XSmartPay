<template>
    <div>
        <div class="cell flex ac mb30">
            <input type="email" v-model="email" :placeholder="$t('邮箱账号')" class="flex1 size28">
        </div>

        <Password v-model="password" :tips="$t('密码')"></Password>

        <div class="cell flex ac mt30">
            <input
                :value="googleCode"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                autocomplete="one-time-code"
                maxlength="6"
                :placeholder="$t('Google验证码（已绑定用户填写）')"
                class="flex1 size28"
                @input="normalizeGoogleCode"
            >
        </div>

        <div class="flex je mt16">
            <div class="size24 grey" @click="routerPush('/forget')">{{ $t('忘记密码') }}?</div>
        </div>

        <div class="mainBtn mt60 flex jc ac size28 bold5" @click="submit">{{ $t('登录') }}</div>
    </div>
</template>

<script setup lang="ts">
import { apiLogin } from '@/api/login';
import { getAccount, setAccount, setToken, upsertAccountItem } from '@/config/storage';
import { t } from '@/locale';
import { routerPush, routerReplace } from '@/router';
import { useUserStore } from '@/store';
import { message } from '@/utils/message';
import { ref } from 'vue';
import Password from './Password.vue';

const email = ref()
const password = ref()
const googleCode = ref('')

const userStore = useUserStore()

const storageAccount = getAccount()
if(storageAccount)email.value = storageAccount

const normalizeGoogleCode = (event: Event) => {
    const input = event.target as HTMLInputElement
    const value = input.value.replace(/\D/g, '').slice(0, 6)
    input.value = value
    googleCode.value = value
}

const submit = async () => {
    if(!email.value)return message(t('请输入邮箱账号'))
    if(!password.value)return message(t('请输入账号密码'))
    if(googleCode.value && !/^\d{6}$/.test(googleCode.value))return message(t('请输入6位Google验证码'))

    const res:any = await apiLogin({
        email: email.value,
        password: password.value,
        ...(googleCode.value ? { google_code: googleCode.value } : {})
    })

    setToken(res.token)
    setAccount(email.value)
    upsertAccountItem({
        email: email.value,
        token: res.token
    })

    try {
        const userInfo:any = await userStore.loadUserInfo()
        if(userInfo?.email && Number(userInfo.google_enabled) === 0){
            routerReplace('/googleAuthenticator')
            return
        }
    } catch {
        // 用户信息加载失败不阻断已经成功的登录，后续 POST 拦截仍会引导绑定。
    }

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

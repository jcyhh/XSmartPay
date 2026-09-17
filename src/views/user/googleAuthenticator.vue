<template>
    <CusNav :title="$t('谷歌验证码')" :show-bg="false" :show-glass="false"></CusNav>

    <main class="google-auth-page flex col ac jc" v-if="loading">
        <van-loading color="#FFE5A5" size="32px">{{ $t('加载中...') }}</van-loading>
    </main>

    <main class="google-auth-page flex col ac jc" v-else-if="loadFailed">
        <section class="state-card tc">
            <h2>{{ $t('加载失败') }}</h2>
            <p>{{ $t('请检查网络后重试') }}</p>
            <button type="button" class="state-button" @click="loadPage">{{ $t('重新加载') }}</button>
        </section>
    </main>

    <main class="google-auth-page enabled-page flex col ac jc" v-else-if="enabled">
        <section class="state-card tc">
            <h2>{{ $t('谷歌验证器已绑定') }}</h2>
            <p>{{ $t('邮箱密码登录时需要输入谷歌验证器生成的6位验证码。') }}</p>
            <p class="state-tip">{{ $t('如需更换或验证器已丢失，请联系客服处理。') }}</p>
        </section>
    </main>

    <main class="google-auth-page enabled-page flex col ac jc" v-else-if="!hasEmail">
        <section class="state-card tc">
            <h2>{{ $t('无需绑定谷歌验证器') }}</h2>
            <p>{{ $t('谷歌验证器仅适用于邮箱登录用户，钱包地址登录不受影响。') }}</p>
        </section>
    </main>

    <main class="google-auth-page enabled-page flex col ac jc" v-else-if="!secret">
        <section class="state-card tc">
            <h2>{{ $t('绑定谷歌验证器') }}</h2>
            <p>{{ $t('绑定后，邮箱密码登录需要同时输入谷歌验证器生成的6位验证码。') }}</p>
            <button type="button" class="state-button" :disabled="bindLoading" @click="startBinding">
                {{ bindLoading ? $t('获取中...') : $t('开始绑定') }}
            </button>
        </section>
    </main>

    <main class="google-auth-page" v-else>
        <div class="scan-tip">{{ $t('使用谷歌验证器扫描此二维码') }}</div>

        <div class="qr-shell">
            <img src="@/assets/user/48.webp" class="qr-frame" alt="">
            <div class="qr-panel flex jc ac">
                <QRCode
                    class="generated-qr"
                    :value="qrValue"
                    :size="300"
                    :bordered="false"
                    error-level="M"
                />
            </div>
        </div>

        <section class="guide-card">
            <div class="tutorial" v-if="tutorial" v-html="tutorial"></div>

            <div class="secret-block">
                <p class="accent">{{ $t('手动输入密钥：') }}</p>
                <button type="button" class="secret" v-copy="secret">{{ secret }}</button>
                <p class="secret-tip">{{ $t('如果无法扫描二维码，请在应用中选择“手动输入”并输入上述密钥') }}</p>
            </div>

            <p class="secondary verify-description">{{ $t('验证码将发送至 {email}', { email: maskedEmail }) }}</p>

            <div class="verify-row">
                <input
                    :value="emailCode"
                    type="text"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    autocomplete="one-time-code"
                    maxlength="6"
                    :placeholder="$t('请输入邮箱验证码')"
                    :aria-label="$t('请输入邮箱验证码')"
                    @input="normalizeEmailCode"
                >
                <CusSms class="code-button flex jc ac" :account="userInfo?.email" :type="7"></CusSms>
            </div>

            <p class="secondary google-description">{{ $t('输入谷歌验证器应用中生成的6位验证码：') }}</p>
            <div class="verify-row">
                <input
                    :value="googleCode"
                    type="text"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    autocomplete="one-time-code"
                    maxlength="6"
                    :placeholder="$t('请输入Google验证码')"
                    :aria-label="$t('请输入Google验证码')"
                    @input="normalizeGoogleCode"
                >
                <button type="button" class="confirm-button" :disabled="submitting" @click="confirmBinding">
                    {{ submitting ? $t('处理中...') : $t('确认设置') }}
                </button>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusSms from '@/components/CusSms/index.vue'
import { computed, onMounted, ref } from 'vue'
import { apiGoogleBind, apiGoogleConfirmBind } from '@/api/user'
import { apiConfig } from '@/api/home'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import { message } from '@/utils/message'
import { t } from '@/locale'
import { logout } from '@/utils/request'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const secret = ref('')
const tutorial = ref('')
const emailCode = ref('')
const googleCode = ref('')
const loading = ref(true)
const loadFailed = ref(false)
const bindLoading = ref(false)
const submitting = ref(false)

const enabled = computed(() => Number(userInfo.value?.google_enabled) === 1)
const hasEmail = computed(() => Boolean(userInfo.value?.email))
const qrValue = computed(() => {
    if(!secret.value || !userInfo.value?.email) return ''
    const email = encodeURIComponent(userInfo.value.email)
    const encodedSecret = encodeURIComponent(secret.value)
    return `otpauth://totp/XSmartPay:${email}?secret=${encodedSecret}&issuer=XSmartPay&algorithm=SHA1&digits=6&period=30`
})
const maskedEmail = computed(() => {
    const email = String(userInfo.value?.email || '')
    const [name, domain] = email.split('@')
    if(!domain || name.length <= 2) return email
    return `${name.slice(0, 2)}${'*'.repeat(Math.min(name.length - 2, 4))}@${domain}`
})

const normalizeCode = (event: Event, target: typeof emailCode) => {
    const input = event.target as HTMLInputElement
    const value = input.value.replace(/\D/g, '').slice(0, 6)
    input.value = value
    target.value = value
}

const normalizeEmailCode = (event: Event) => normalizeCode(event, emailCode)
const normalizeGoogleCode = (event: Event) => normalizeCode(event, googleCode)

const loadPage = async () => {
    loading.value = true
    loadFailed.value = false
    secret.value = ''
    emailCode.value = ''
    googleCode.value = ''

    try {
        const [, config] = await Promise.all([
            userStore.loadUserInfo(),
            apiConfig().catch(() => ({}))
        ])
        tutorial.value = String((config as any)?.google_2fa_tutorial || '')
    } catch {
        loadFailed.value = true
    } finally {
        loading.value = false
    }
}

const startBinding = async () => {
    if(bindLoading.value) return

    bindLoading.value = true
    try {
        const data = await apiGoogleBind()
        if(!data?.secret) throw new Error('Invalid Google bind response')
        secret.value = data.secret
    } finally {
        bindLoading.value = false
    }
}

const confirmBinding = async () => {
    if(!/^\d{6}$/.test(emailCode.value)) return message(t('请输入6位邮箱验证码'))
    if(!/^\d{6}$/.test(googleCode.value)) return message(t('请输入6位Google验证码'))
    if(submitting.value) return

    submitting.value = true
    try {
        await apiGoogleConfirmBind({
            email_code: emailCode.value,
            code: googleCode.value
        })
        message(t('绑定成功，请重新登录'), 'success')
        setTimeout(() => logout(), 1200)
    } finally {
        submitting.value = false
    }
}

onMounted(loadPage)
</script>

<style lang="scss" scoped>
.google-auth-page{
    min-height: calc(100dvh - 100px);
    padding-top: 68px;
    padding-bottom: 30px;
    background-color: #0A0A0A;
}

.scan-tip{
    font-size: 24px;
    line-height: 34px;
    text-align: center;
}

.qr-shell{
    width: 480px;
    height: 480px;
    margin: 60px auto 0;
    position: relative;
}

.qr-frame{
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
}

.qr-panel{
    width: 360px;
    height: 360px;
    padding: 30px;
    border-radius: 40px;
    background-color: #FFFFFF;
    position: absolute;
    top: 60px;
    left: 60px;
    overflow: hidden;
}

.generated-qr{
    width: 300px !important;
    height: 300px !important;
    flex: 0 0 auto;
}

.generated-qr :deep(.qrcode-svg),
.generated-qr :deep(.qrcode-svg svg){
    display: block;
    width: 100%;
    height: 100%;
}

.guide-card{
    width: 690px;
    margin: 60px auto 0;
    padding: 40px 30px;
    border-radius: 20px;
    background-color: #242424;

    h2{
        font-size: 28px;
        font-weight: 500;
        line-height: 39px;
    }
}

.tutorial{
    color: rgba(255, 255, 255, 0.7);
    font-size: 24px;
    line-height: 40px;
    overflow-wrap: anywhere;
}

.state-card .tutorial{
    margin-top: 30px;
}

.tutorial :deep(img){
    max-width: 100%;
    height: auto;
}

.secondary{
    color: rgba(255, 255, 255, 0.5);
    font-size: 24px;
    line-height: 34px;
}

.secret-block{
    font-size: 24px;
    line-height: 34px;
}

.accent,
.secret-tip{
    color: #FF9500;
}

.secret{
    display: block;
    max-width: 100%;
    margin-top: 12px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #4C91FF;
    font: inherit;
    line-height: inherit;
    text-align: left;
    text-decoration: underline;
    overflow-wrap: anywhere;
    cursor: pointer;
}

.secret-tip{
    margin-top: 12px;
    font-size: 20px;
    line-height: 28px;
}

.verify-description{
    margin-top: 24px;
}

.google-description{
    margin-top: 28px;
}

.verify-row{
    display: flex;
    gap: 8px;
    margin-top: 20px;

    input,
    button,
    .code-button{
        height: 88px;
        border-radius: 20px;
    }

    input{
        min-width: 0;
        flex: 1;
        padding: 0 30px;
        background-color: #3B3B3B;
        color: #FFFFFF;
        font-size: 28px;
        line-height: 39px;

        &::placeholder{
            color: rgba(184, 195, 212, 0.5);
        }
    }
}

.confirm-button,
.code-button{
    width: 186px;
    flex: 0 0 186px;
    border: 0;
    background: linear-gradient(90deg, #EFB152 0%, #EFCD80 49.4%, #EFB152 100%);
    color: #000000;
    font-size: 24px;
    font-weight: 600;
    white-space: nowrap;
}

.confirm-button:disabled,
.state-button:disabled{
    opacity: 0.6;
}

.enabled-page{
    padding: 30px;
}

.state-card{
    width: 690px;
    padding: 50px 30px 40px;
    border: 1px solid #FFFFFF1A;
    border-radius: 20px;
    background: linear-gradient(180deg, rgba(255, 229, 165, 0.12) 0%, rgba(255, 229, 165, 0.04) 100%);

    h2{
        font-size: 32px;
        line-height: 45px;
    }

    > p{
        margin-top: 24px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 24px;
        line-height: 40px;
    }
}

.state-button{
    width: 100%;
    height: 88px;
    margin-top: 40px;
    border: 0;
    border-radius: 44px;
    background: linear-gradient(90deg, #EFB152 0%, #EFCD80 49.4%, #EFB152 100%);
    color: #000000;
    font-size: 28px;
    font-weight: 600;
}

.state-card .state-tip{
    margin-top: 20px;
    font-size: 22px;
}
</style>

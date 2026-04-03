<template>
    <CusNav :title="$t('切换账号')"></CusNav>
    <div class="pl30 pr30 pt30 rel">
        <template v-if="accountList.length > 0">
            <div class="flex jb ac cell mb20" v-for="item in accountList" :key="item.email">
                <div class="size28 bold6" v-init:address="item.email"></div>
                <div>
                    <div class="size28 main bold6" v-if="item.email === currentEmail">{{ $t('当前登录') }}</div>
                    <div class="mainButton btn size24 bold6 flex ac" v-else @click="switchAccount(item)">{{ $t('切换') }}</div>
                </div>
            </div>
        </template>

        <CusEmpty v-else></CusEmpty>
    </div>

    <div class="safeArea"></div>
    <div class="gap130"></div>
    <div class="bottom">
        <div class="mainBtn size28 bold6 flex jc ac" @click="routerPush('/login')">{{ $t('添加账号') }}</div>
        <div class="safeArea"></div>
    </div>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusEmpty from '@/components/CusEmpty/index.vue'
import { getAccount, getAccountList, setAccount, setToken, type LoginAccountItem } from '@/config/storage'
import { t } from '@/locale'
import { routerPush, routerReplace } from '@/router'
import { message } from '@/utils/message'
import { ref } from 'vue'

const accountList = ref<LoginAccountItem[]>(getAccountList())
const currentEmail = ref(getAccount())

const switchAccount = (item: LoginAccountItem) => {
    if (!item?.token) return
    setToken(item.token)
    setAccount(item.email)
    currentEmail.value = item.email
    message(t('切换成功'), 'success')
    routerReplace('/user/index')
}
</script>

<style lang="scss" scoped>
.cell{
    background: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    padding: 20px 30px;
    border-radius: 14px;
    .btn{
        height: 48px;
        padding: 0 20px;
    }
}
.bottom {
    width: 100vw;
    padding: 20px 30px 30px 30px;
    background-color: #040404;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
}
</style>
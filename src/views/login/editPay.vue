<template>
    <CusNav :title="$t('修改支付密码')"></CusNav>
    <div class="pl30 pr30 pt30 rel">

        <Password v-model="o_password" :tips="$t('旧密码')"></Password>

        <div class="gap30"></div>

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
import { routerGo } from '@/router';

const o_password = ref()
const n_password = ref()
const passwordAgain = ref()

const submit = async () => {
    if(!o_password.value)return message(t('请输入旧密码'))
    if(!n_password.value)return message(t('请输入新密码'))
    if(!passwordAgain.value)return message(t('请再次输入新密码'))
    if(n_password.value != passwordAgain.value)return message(t('新密码输入不一致'))

    await apiEditPassword({
        o_password: o_password.value,
        n_password: n_password.value,
        type: 2
    })

    message(t('修改成功'), 'success')
    setTimeout(() => routerGo(), 1200);
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
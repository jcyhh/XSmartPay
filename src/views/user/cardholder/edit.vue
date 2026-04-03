<template>
    <CusNav :title="$t('持卡人信息')" :show-bg="false"></CusNav>
    <div class="pl30 pr30 pt30">
        
        <div class="size28 bold5">{{ $t('持卡人名字') }}</div>
        <div class="cell flex ac mt20">
            <input type="text" v-model="form.first_name" :placeholder="$t('请输入大写字母')" class="flex1 size28">
        </div>

        <div class="size28 bold5 mt30">{{ $t('持卡人姓氏') }}</div>
        <div class="cell flex ac mt20">
            <input type="text" v-model="form.last_name" :placeholder="$t('请输入大写字母')" class="flex1 size28">
        </div>

        <div class="size28 bold5 mt30">{{ $t('电话号码') }}</div>
        <div class="cell flex ac mt20">
            <input type="text" v-model="form.phone" :placeholder="$t('请输入电话号码')" class="flex1 size28">
        </div>

        <div class="size28 bold5 mt30">{{ $t('邮箱') }}</div>
        <div class="cell flex ac mt20">
            <input type="text" v-model="form.email" :placeholder="$t('请输入邮箱')" class="flex1 size28">
        </div>

        <div class="size28 bold5 mt30">{{ $t('邮编') }}</div>
        <div class="cell flex ac mt20">
            <input type="text" v-model="form.postal_code" :placeholder="$t('请输入邮编')" class="flex1 size28">
        </div>

        <div class="size28 bold5 mt30">{{ $t('国家') }}</div>
        <div class="cell flex jb ac mt20 size28" @click="pickerShow=true">
            <div v-if="currentCountry">{{ currentCountry.name }}({{ currentCountry.country_code }})</div>
            <div class="gray" v-else>{{ $t('请选择国家') }}</div>
            <div class="gray">
                <van-icon name="arrow" />
            </div>
        </div>

        <div class="size28 bold5 mt30">{{ $t('省/州') }}</div>
        <div class="cell flex ac mt20">
            <input type="text" v-model="form.state" :placeholder="$t('请输入省/州')" class="flex1 size28">
        </div>

        <div class="size28 bold5 mt30">{{ $t('城市') }}</div>
        <div class="cell flex ac mt20">
            <input type="text" v-model="form.city" :placeholder="$t('请输入城市')" class="flex1 size28">
        </div>

        <div class="size28 bold5 mt30">{{ $t('街道地址') }}</div>
        <div class="cell flex ac mt20">
            <input type="text" v-model="form.line1" :placeholder="$t('请输入街道地址')" class="flex1 size28">
        </div>

    </div>

    <div class="safeArea"></div>
    <div class="gap150"></div>
    <div class="bottom">
        <div class="mainBtn size28 bold6 flex jc ac" @click="submit">{{ $t('保存') }}</div>
        <div class="safeArea"></div>
    </div>

    <CusPicker v-model:show="pickerShow" :list="countrys" :title="$t('请选择')" :default-index="current" @change="$event=>current=$event">
        <template v-slot="{ item }">
            <span class="bold5">{{ item.name }}({{ item.country_code }})</span>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { t } from '@/locale';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import CusPicker from '@/components/CusPicker/index.vue';
import { message } from '@/utils/message';
import { apiCardholderAdd, apiCardholderInfo, apiCardholderUpdate } from '@/api/user';
import { routerGo } from '@/router';

const { params } = useRoute()

const current = ref(-1)
const pickerShow = ref(false)
const countrys = computed(()=>([
    {name:t('法国'), country:'France', country_code:'FR'},
    {name:t('柬埔寨'), country:'Cambodia', country_code:'KH'},
    {name:t('韩国'), country:'SouthKorea', country_code:'KR'},
    {name:t('马来西亚'), country:'Malaysia', country_code:'MY'},
    {name:t('美国'), country:'UnitedStates', country_code:'US'},
    {name:t('日本'), country:'Japan', country_code:'JP'},
    {name:t('新加坡'), country:'Singapore', country_code:'SG'},
    {name:t('泰国'), country:'Thailand', country_code:'TH'},
    {name:t('越南'), country:'Vietnam', country_code:'VN'},
    {name:t('印度'), country:'India', country_code:'IN'},
    {name:t('印度尼西亚'), country:'Indonesia', country_code:'ID'},
    {name:t('英国'), country:'United Kingdom', country_code:'GB'},
    {name:t('中国'), country:'中国', country_code:'CN'},
]))
const currentCountry = computed(()=> current.value >= 0 ? countrys.value[current.value] : null)

const form = ref({
    first_name: '',
    last_name:'',
    phone: '',
    email: '',
    state:'',
    city: '',
    line1: '',
    postal_code:''
})

const cardholder_id = ref()
const loadData = async () => {
    if(params?.id == 'add')return
    const res:any = await apiCardholderInfo(params?.id)
    cardholder_id.value = res.cardholder_id
    form.value.first_name = res.first_name
    form.value.last_name = res.last_name
    form.value.phone = res.phone
    form.value.email = res.email
    form.value.state = res.state
    form.value.city = res.city
    form.value.line1 = res.address
    form.value.postal_code = res.zipcode
    current.value = countrys.value.findIndex(item=>item.country_code==res.country_code)
}

const submit = async () => {
    if(!form.value.first_name) return message(t('请输入持卡人名字'))
    if(!form.value.last_name) return message(t('请输入持卡人姓氏'))
    if(!form.value.phone) return message(t('请输入电话号码'))
    if(!form.value.email) return message(t('请输入邮箱'))
    if(!form.value.postal_code) return message(t('请输入邮编'))
    if(!currentCountry.value) return message(t('请选择国家'))
    if(!form.value.state) return message(t('请输入省/州'))
    if(!form.value.city) return message(t('请输入城市'))
    if(!form.value.line1) return message(t('请输入街道地址'))

    if(params?.id === 'add'){
        await apiCardholderAdd({
            ...form.value,
            ...{
                country: currentCountry.value.country,
                country_code:currentCountry.value?.country_code,
            }
        })
    }else{
        await apiCardholderUpdate({
            ...form.value,
            ...{
                country: currentCountry.value.country,
                country_code:currentCountry.value?.country_code,
                cardholder_id: cardholder_id.value
            }
        })
    }

    message(t('保存成功'), 'success')
    setTimeout(() => {
        routerGo()
    }, 1200);
}

onMounted(()=>{
    loadData()
})
</script>

<style lang="scss" scoped>
.cell{
    background: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    padding: 0 30px;
    height: 88px;
    border-radius: 14px;
}
.bottom{
    width: 100vw;
    padding: 20px 30px 30px 30px;
    background-color: #040404;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
}
</style>
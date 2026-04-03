<template>
    <VanPopup v-model:show="show" style="background: transparent;" position="bottom" overlay-class="cusMask" teleport="#app">
        <div class="popup">
            <div class="content">
                <div class="flex jb ac">
                    <div class="size28 main bold6">{{ $t('修改密码') }}</div>
                    <van-icon size="20" name="cross" color="#8D9094" @click="show=false" />
                </div>

                <div class="flex jb ac mt60">
                    <div class="size28 bold5">{{ $t('选择卡') }}</div>
                </div>

                <div class="inp flex jb ac mt20 size28" @click="pickerShow=true">
                    <div v-if="currentPicker">{{ currentPicker.card_number }}</div>
                    <div class="gray" v-else>{{ $t('请选择卡') }}</div>
                    <div class="gray">
                        <van-icon name="arrow" />
                    </div>
                </div>

                <div class="size28 bold5 mt30">{{ $t('新交易密码') }}</div>
                <div class="inp flex jb ac mt20 size28">
                    <input type="password" v-model="password" :placeholder="$t('请输入交易密码')" class="flex1">
                </div>

                <div class="size28 bold5 mt30">{{ $t('确认密码') }}</div>
                <div class="inp flex jb ac mt20 size28">
                    <input type="password" v-model="password1" :placeholder="$t('请再次输入新交易密码')" class="flex1">
                </div>

                <div class="mainBtn mt100 flex jc ac size28 main bold6 btn" @click="submit">{{ $t('确认') }}</div>

                <div class="safeArea"></div>
            </div>
        </div>
    </VanPopup>

    <CusPicker v-model:show="pickerShow" :list="pickerList" :title="$t('请选择')" :default-index="pickerCurrent" @change="$event=>pickerCurrent=$event">
        <template v-slot="{ item }">
            <span class="bold5">{{ item.card_number }}</span>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import { useCard } from '@/hooks/useCardholder';
import { ref } from 'vue';
import CusPicker from '@/components/CusPicker/index.vue';
import { message } from '@/utils/message';
import { t } from '@/locale';
import { apiCardPsw } from '@/api/card';

const { pickerShow, pickerList, currentPicker, pickerCurrent, loadPickerList } = useCard()

const show = ref(false)

const password = ref()
const password1 = ref()

const open = () => {
    show.value = true
    loadPickerList()
}

const submit = async () => {
    if(!currentPicker.value)return message(t('请选择卡'))
    if(!password.value)return message(t('请输入交易密码'))
    if(!password1.value)return message(t('请再次输入交易密码'))
    if(password.value != password1.value)return message(t('密码输入不一致'))
    await apiCardPsw({
        pin: password.value,
        card_id: currentPicker.value.id
    })
    message(t('修改成功'), 'success')
    show.value = false
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
.inp{
    height: 90px;
    padding: 0 30px;
    background-color: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    border-radius: 14px;
    .line{
        width: 1px;
        height: 44px;
        background-color: #FFFFFF33;
    }
}
</style>
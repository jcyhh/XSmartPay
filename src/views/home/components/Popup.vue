<template>
    <VanPopup v-model:show="show" style="background: transparent;" :close-on-click-overlay="false" overlay-class="cusMask" teleport="#app">
        <div class="popupCenter mainCard">
            <div class="content">
                <div class="flex jb ac">
                    <div class="size28 main bold6">{{ $t('理财档位') }}</div>
                </div>

                <div class="cell mt40 flex jb ac" @click="showPicker=true">
                    <div>{{ currentLevel?.name || '--' }}</div>
                    <van-icon name="arrow" />
                </div>

                <div class="size24 mt20">
                    <span class="opc6">充值时缴纳充值额</span>
                    <span class="main ml5 mr5">{{ currentLevel?.service_rate }}%</span>
                    <span class="opc6">服务费</span>
                </div>
                <div class="size24 mt20">
                    <span class="opc6">享受充值额</span>
                    <span class="main ml5 mr5">{{ currentLevel?.gift_rate }}%</span>
                    <span class="opc6">等值的AIX释放权益</span>
                </div>

                <div class="mt50 flex ac bold5">
                    <div class="mainBtn flex1 btn flex jc ac" @click="submit">{{ $t('确认') }}</div>
                </div>
            </div>
        </div>
    </VanPopup>

    <CusPicker v-model:show="showPicker" :list="list" :title="$t('请选择')" :default-index="current" @change="$event=>current=$event">
        <template v-slot="{ item }">
            <span class="bold5">{{ item.name }}</span>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import { apiLeves, apiUpdateUserInfo } from '@/api/user';
import CusPicker from '@/components/CusPicker/index.vue';
import { t } from '@/locale';
import { useUserStore } from '@/store';
import { message } from '@/utils/message';
import { computed, onMounted, ref } from 'vue';

const userStore = useUserStore()

const showPicker = ref(false)

const show = defineModel<boolean>('show', { default: false })

const current = ref(0)

const list = ref<any[]>([])

const currentLevel = computed(()=>{
    if(list.value.length>0)return list.value[current.value]
    else return null
})

const loadData = async () => {
    const res:any = await apiLeves()
    list.value = res.data
}

const submit = async () => {
    await apiUpdateUserInfo({
        finance_level_id: currentLevel.value?.id
    })
    message(t('操作成功'), 'success')
    show.value = false
    userStore.loadUserInfo()
}

onMounted(()=>{
    loadData()
})
</script>

<style lang="scss" scoped>

</style>
<template>
    <div class="flex jb ac mb30">
        <div class="size28">{{ $t('社区成员') }}</div>
        <div class="size24 opc5" @click="show=!show" v-if="isLeader">{{ show ? $t('取消') : $t('管理') }}</div>
    </div>

    <van-list v-bind="listProps">
        <div class="cell mb20 card" v-for="item in list" :key="item.user_id" @click="onChoose(item.user_id)">
            <div class="flex jb ac">
                <div class="flex ac">
                    <div v-if="show && leaderId!=item.user_id">
                        <img src="@/assets/user/30.png" class="img32 mr10 animate__animated animate__zoomIn ani3" v-if="chooseIds.includes(item.user_id)">
                        <img src="@/assets/user/31.png" class="img32 mr10" v-else>
                    </div>
                    <div class="size28 bold5">{{ item.email || item.address }}</div>
                    <div class="tag flex ac mainBtn ml20" v-if="leaderId==item.user_id">{{ $t('社区CEO') }}</div>
                </div>
                <div class="size28 bold main" v-init="item.kpi"></div>
            </div>
            <div class="flex jb mt20 size24 opc5">
                <div>{{ item.joined_at }}</div>
                <div>{{ $t('今日推荐业绩') }}</div>
            </div>
        </div>
        <CusEmpty v-if="list?.length == 0"></CusEmpty>
    </van-list>

    <div class="gap60"></div>
    <div class="delbtn flex jc ac size28 bold6 animate__animated animate__slideInUp" v-if="show" @click="submit">{{ $t('踢出社区') }}</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useLoadList } from '@/hooks/useLoadList';
import CusEmpty from '@/components/CusEmpty/index.vue'
import { message } from '@/utils/message';
import { t } from '@/locale';
import { apiCommunityKick } from '@/api/community';

const props = defineProps(['isLeader', 'leaderId'])

const show = ref(false)

const chooseIds = ref<any[]>([])

watch(show, ()=>chooseIds.value=[])

const onChoose = (id: any) => {
    if (!show.value) return
    if (!props.isLeader) return
    if (chooseIds.value.includes(id)) {
        chooseIds.value = chooseIds.value.filter((x) => x !== id)
    } else {
        chooseIds.value.push(id)
    }
}

const { list, props: listProps, loadList } = useLoadList('/api/community/members', 'members')
loadList()

const submit = async () => {
    if(chooseIds.value.length==0)return message(t('请先选择成员'))
    await apiCommunityKick({
        user_ids: chooseIds.value
    })
    message(t('操作成功'), 'success')
    loadList()
}
</script>

<style lang="scss" scoped>
.card{
    padding: 30px;
    border-radius: 20px;
    &::before{
        border-radius: 20px;
    }
}
.delbtn{
    width: 690px;
    height: 80px;
    border-radius: 40px;
    background-color: $red;
    position: fixed;
    bottom: 72px;
    left: 30px;
    z-index: 5;
}
.tag{
    height: 38px;
    border-radius: 10px;
    padding: 0 12px;
    font-size: 20px;
}
</style>
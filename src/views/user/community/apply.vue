<template>
    <CusNav :title="$t('新成员')" :show-bg="false" :show-glass="false"></CusNav>
    <CusTab v-model="current" :list="tabs"></CusTab>

    <van-pull-refresh class="page rel" v-bind="props">
        <van-list class="page" v-bind="listProps">
            <div class="pl30 pr30">
        
                <div class="cell card mb20 flex jb ac" v-for="(item,index) in list" :key="index">
                    <div>
                        <div class="size28 bold5">{{ item.email || item.address }}</div>
                        <div class="size24 mt10 opc5">{{ item.created_at  }}</div>
                    </div>
                    <div class="flex size28 bold6" v-if="current==0">
                        <div class="mainButton mainButtonDel flex jc ac main btn flex1 mr12" v-scale @click="audit(2, item.id)">{{ $t('拒绝') }}</div>
                        <div class="mainButton flex jc ac main btn flex1" v-scale @click="audit(1, item.id)">{{ $t('通过') }}</div>
                    </div>
                    <div class="size28 bold6 green" v-else-if="current==1">{{ $t('已通过') }}</div>
                    <div class="size28 bold6 opc5" v-else>{{ $t('已拒绝') }}</div>
                </div>

                <CusEmpty v-if="list?.length==0"></CusEmpty>
            </div>
        </van-list>
    </van-pull-refresh>
    
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusTab from '@/components/CusTab/index.vue'
import { computed, ref, watch } from 'vue'
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue'
import { apiCommunityAudit } from '@/api/community';
import { message } from '@/utils/message';
import { t } from '@/locale';

const current = ref(0)

const tabs = computed(()=>([
    {
        name: t('待审核'),
        value: 0
    },
    {
        name: t('已同意'),
        value: 1
    },
    {
        name: t('已拒绝'),
        value: 2
    }
]))

const params = computed(()=>({status: tabs.value[current.value].value}))
const { list, props: listProps, loadList } = useLoadList('/api/community/apply_list', 'requests', params)
const { props } = usePullRefresh(loadList)

watch(current, () => loadList(), {immediate:true})

const audit = async (status:number, id:any) => {
    await apiCommunityAudit({
        status,
        apply_id: id
    })
    message(t('操作成功'), 'success')
    loadList()
}
</script>

<style lang="scss" scoped>
.card{
    border-radius: 20px;
    padding: 30px;
    &::before{
        border-radius: 20px;
    }
    .btn{
        height: 60px;
        border-radius: 30px;
        width: 110px;
    }
}
.page{
    width: 100vw;
    min-height: calc(100vh - 200px);
    min-height: calc(100dvh - 200px);
}
</style>
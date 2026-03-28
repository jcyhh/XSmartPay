<template>
    <CusNav :title="$t('公告列表')"></CusNav>

    <van-pull-refresh class="fullPage rel" v-bind="props">
        <van-list class="fullPage" v-bind="listProps">
            <div class="pl30 pr30 pt30">

                <div class="mainBox mb20 flex jb ac" v-for="(item,index) in list" :key="index" @click="routerPush(`/notice/${item.id}`)">
                    <div class="leftNotice">
                        <div class="line1 size28">{{ item.title }}</div>
                        <div class="size24 gray mt10" v-init:time="item.updated_at"></div>
                    </div>
                    <van-icon name="arrow" :size="20" color="#999999" />
                </div>

            </div>
            <CusEmpty v-if="list?.length==0"></CusEmpty>
        </van-list>
    </van-pull-refresh>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue'
import { routerPush } from '@/router';

const { list, props: listProps, loadList } = useLoadList('/api/notices', 'notices')
const { props } = usePullRefresh(loadList)
loadList()
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
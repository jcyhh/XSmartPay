<template>
    <CusNav :title="$t('申请记录')"></CusNav>
    <van-pull-refresh class="fullPage rel" v-bind="props">
        <van-list class="fullPage" v-bind="listProps">
            <div class="pl30 pr30 rel pt30">
        
                <div class="cell card mb20" v-for="(item,index) in list" :key="index">
                    <div class="flex jb ac">
                        <div class="size28 bold6 main">{{ item.recipient_name }}</div>
                        <div class="size28 bold6 opc5" v-if="item.ship_status==0">{{ item.ship_status_text }}</div>
                        <div class="size28 bold6 green" v-else-if="item.ship_status==1">{{ item.ship_status_text }}</div>
                        <div class="size28 bold6 green" v-else>{{ item.ship_status_text }}</div>
                    </div>
                    <div class="flex jb ac mt20 size24 opc5">
                        <div v-init:phone="item.recipient_phone"></div>
                        <div>{{ item.created_at }}</div>
                    </div>
                    <div class="pt20" v-if="item.tracking_company">
                        <div class="line mb20"></div>
                        <div class="size26 flex jb ac">
                            <div class="opc5">{{ $t('物流') }}</div>
                            <div class="opc6">{{ item.tracking_company }}</div>
                        </div>
                        <div class="size26 flex jb ac mt20" v-if="item.tracking_no">
                            <div class="opc5">{{ $t('快递单号') }}</div>
                            <div class="flex ac opc6" v-copy="item.tracking_no">
                                <div>{{ item.tracking_no }}</div>
                                <img src="@/assets/user/17.png" class="img26 ml10">
                            </div>
                        </div>
                    </div>
                    
                </div>
                <CusEmpty v-if="list?.length==0"></CusEmpty>
            </div>
        </van-list>
    </van-pull-refresh>
    
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue'

const { list, props: listProps, loadList } = useLoadList('/api/card/physical/list', 'data')
const { props } = usePullRefresh(loadList)
loadList()
</script>

<style lang="scss" scoped>
.card{
    border-radius: 20px;
    padding: 30px;
    &::before{
        border-radius: 20px;
    }
    .line{
        width: 100%;
        height: 1px;
        background-color: #FFFFFF33;
    }
}
</style>
<template>
    <CusNav :title="$t('汇款记录')"></CusNav>
    <van-pull-refresh class="fullPage rel" v-bind="props">
        <van-list class="fullPage" v-bind="listProps">
            <div class="pl30 pr30 pt30 rel">
        
                <div class="cell card mb24" v-for="(item,index) in list" :key="index" @click="routerPush(`/pay/record/${item.id}`)">
                    <div class="flex jb ac">
                        <div class="size28 bold6">{{ $t('订单号') }} {{ item.order_no || '--' }}</div>
                        <div class="size28 bold6 green" v-if="item.status==40">{{ item.status_text }}</div>
                        <div class="size28 bold6 red" v-else-if="item.status==20">{{ item.status_text }}</div>
                        <div class="size28 bold6 main" v-else>{{ item.status_text }}</div>
                    </div>
                    <div class="flex jb ac mt30">
                        <div class="size24 opc5 mr10">{{ $t('支付金额') }}</div>
                        <div class="size24 bold5">
                            <span v-init="item.paid_amount"></span>
                            <span class="ml5">{{ item.paid_currency }}</span>
                        </div>
                    </div>
                    <div class="flex jb ac mt20">
                        <div class="size24 opc5 mr10">{{ $t('到账金额') }}</div>
                        <div class="size24 bold5">
                            <span v-init="item.received_amount"></span>
                            <span class="ml5">{{ item.received_currency }}</span>
                        </div>
                    </div>
                    <div class="line mt24 mb24"></div>
                    <div class="flex jb ac mt20">
                        <div class="size24 opc5 mr10">{{ item.created_at }}</div>
                        <div class="size24 bold5 flex ac opc5">
                            <div>{{ $t('查看详情') }}</div>
                            <van-icon name="arrow" />
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
import { routerPush } from '@/router';

const { list, props: listProps, loadList } = useLoadList('/api/global_pay/remittance', 'data')
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
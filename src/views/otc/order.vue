<template>
    <CusNav :title="$t('全部订单')" :show-bg="false" :show-glass="false"></CusNav>

    <CusTab v-model="current" :list="tabs"></CusTab>

    <div class="ccys">
        <div class="ccyBox flex ac">
            <div class="ccyItem mr60 bold6" v-for="(item,index) in ccys" :key="index" @click="onCcyChange(index)">
                <span :class="index==ccyCur?'main':''">{{ item.name }}</span>
                <div class="ccyLine animate__animated animate__zoomIn ani3" v-if="index==ccyCur"></div>
            </div>
        </div>
    </div>

    <div class="gap90"></div>

    <van-pull-refresh class="list rel" v-bind="props">
        <van-list class="list" v-bind="listProps">
            <div class="pl30 pr30 mb30">

                <div class="card mb20" v-for="(item,index) in 10" :key="index" @click="routerPush('/otc/detail/sale')">
                    <div class="flex jb ac">
                        <div class="flex ac">
                            <div class="tag in">买入</div>
                            <div class="ml16">
                                <span class="size32">{{ assetUSDT }}</span>
                                <span class="size32 opc5">/</span>
                                <span class="size24 opc5">CNY</span>
                            </div>
                        </div>
                        <div class="size24 green">交易中</div>
                    </div>
                    <div class="size24 opc5 mt20">2025.12.30 09:34:54</div>
                    <div class="flex mt24">
                        <div class="flex1">
                            <div class="size20 opc5">交易单价</div>
                            <div class="size24 bold5 mt10">
                                <span>¥</span>
                                <span v-init="1000"></span>
                            </div>
                        </div>
                        <div class="flex1">
                            <div class="size20 opc5">交易数量({{ assetUSDT }})</div>
                            <div class="size24 bold5 mt10">
                                <span v-init="1000"></span>
                            </div>
                        </div>
                        <div class="flex1">
                            <div class="size20 opc5">交易总额</div>
                            <div class="size24 bold5 mt10">
                                <span v-init="1000"></span>
                            </div>
                        </div>
                    </div>
                    <div class="cancel flex jc ac mt30 size24">撤销委托单</div>
                </div>
            </div>
        </van-list>
    </van-pull-refresh>

    <CusAsk v-model:show="showAsk" title="撤销委托单">
        <div class="size28">确认撤销此委托单吗？</div>
    </CusAsk>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusTab from '@/components/CusTab/index.vue'
import { assetAIX, assetNFTC, assetUSDT } from '@/config';
import { t } from '@/locale';
import { computed, ref } from 'vue';
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue'
import CusAsk from '@/components/CusAsk/index.vue'
import { routerPush } from '@/router';

const current = ref(0)
const tabs = computed(() => ([
    {
        name: t('委托订单'),
        value: 1
    },
    {
        name: t('交易订单'),
        value: 0
    }
]))

const ccyCur = ref(0)
const ccys = computed(()=>([
    {name:t('全部'), value:0},
    {name:assetUSDT, value:1},
    {name:assetAIX, value:2},
    {name:assetNFTC, value:3}
]))
const onCcyChange = (index:number) => {
    if(ccyCur.value==index)return
    ccyCur.value = index
}

const showAsk = ref(false)

// 列表
const { list, props: listProps, loadList } = useLoadList('/api/notices', 'notices')
const { props } = usePullRefresh(loadList)
// loadList()
</script>

<style lang="scss" scoped>
.ccys{
    height: 90px;
    width: 100vw;
    background-color: #040404;
    position: fixed;
    top: 250px;
    left: 0;
    z-index: 10;
    .ccyBox{
        border-bottom: 1px solid #FFFFFF33;
        padding-left: 30px;
        .ccyItem{
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding-bottom: 10px;
            .ccyLine{
                width: 40px;
                height: 4px;
                border-radius: 2px;
                background-color: #FFE5A5;
                position: absolute;
                bottom: 0;
            }
        }
    }
}
.list{
    width: 100%;
    min-height: calc(100vh - 340px);
    min-height: calc(100vh - 340dvh);
}
.card{
    background-color: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    border-radius: 20px;
    padding: 30px;
    .tag{
        height: 44px;
        border-radius: 10px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        font-size: 24px;
    }
    .in{
        background-color: #2CA230;
    }
    .out{
        background-color: #E33232;
    }
    .cancel{
        height: 66px;
        border-radius: 33px;
        background-color: #E332321A;
        color: #E33232;
        border: 1px solid #E3323280;
    }
}
</style>
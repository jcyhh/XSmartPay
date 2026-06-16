<template>
    <CusNav :title="$t('我的NFT')"></CusNav>

    <van-pull-refresh class="fullPage rel" v-bind="props">
        <van-list class="fullPage" v-bind="listProps">
            <div class="pl30 pr30 pt30 rel">
                <div class="cell card mb20" v-for="(item, index) in list" :key="index">
                    <div class="flex ac">
                        <img :src="item.logo" class="img100 avatar">
                        <div class="flex1">
                            <div class="flex jb ac">
                                <div class="size28 bold6 main">{{ item.name }}</div>
                                <div class="size24 bold6 main">
                                    <span v-init="item.amount"></span>
                                    <span class="ml5">USDT</span>
                                </div>
                            </div>
                            <div class="mt10 flex jb ac size24 opc5">
                                <div>{{ item.created_at }}</div>
                                <div>{{ $t('价值') }}</div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <CusEmpty v-if="list?.length == 0"></CusEmpty>
            </div>
        </van-list>
    </van-pull-refresh>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue'

const { list, props: listProps, loadList } = useLoadList('/api/node', 'node_orders')
const { props } = usePullRefresh(loadList)
loadList()
</script>

<style lang="scss" scoped>
.card {
    padding: 24px 24px 20px 24px;
    border-radius: 20px;

    &::before {
        border-radius: 20px;
    }

    .avatar {
        border-radius: 16px;
        margin-right: 20px;
    }

    .line {
        width: 100%;
        height: 1px;
        background-color: #FFFFFF33;
    }

    .desc {
        width: 300px;
    }

    .btn {
        height: 60px;
        padding: 0 20px;
        border-radius: 30px;
        font-size: 28px;
        font-weight: 600;
    }
}

.box {
    background: linear-gradient(#C19F4F4D, #C19F4F00);
    padding: 40px 10px 12px 10px;
    border-radius: 20px;
}

.btn {
    height: 88px;
    border-radius: 44px;
}

.bottom {
    width: 100vw;
    padding: 20px 30px 30px 30px;
    background-color: #040404;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
}
</style>
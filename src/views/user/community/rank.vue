<template>
    <CusNav :title="$t('排行榜')" :show-bg="false">
        <!-- <div class="flex je ac">
            <img src="@/assets/user/32.png" class="img32">
            <div class="size24 opc5 ml5">规则说明</div>
        </div> -->
    </CusNav>
    <div class="bg"></div>

    <van-pull-refresh class="fullPage rel" v-bind="props">
        <van-list class="fullPage" v-bind="listProps">
            <div class="pl60 pr60 pt90 rel">

                <CusTitle :title="$t('全网社区排行榜')"></CusTitle>

                <div class="gap50"></div>

                <div class="rank mb20" :class="{
                    'rank1': index == 0,
                    'rank2': index == 1,
                    'rank3': index == 2,
                    'rank4': index > 2
                }" v-for="(item, index) in list" :key="index">
                    <div class="flex jb ac">
                        <div class="avatarBox flex jc ac" v-if="index <= 2">
                            <img src="@/assets/user/33.png" class="avaterborder" v-if="index == 0">
                            <img src="@/assets/user/34.png" class="avaterborder" v-else-if="index == 1">
                            <img src="@/assets/user/35.png" class="avaterborder" v-else>
                            <img src="@/assets/user/20.png" class="avatar img92">
                        </div>
                        <img :src="item.logo" class="avatar img92" v-else>
                        <div class="flex jb ac flex1 ml20">
                            <div>
                                <div class="size28 bold6">{{ item.name }}</div>
                                <div class="size24 opc5 mt10">{{ $t('社区人数') }} {{ item.member_count }}{{ $t('人') }}</div>
                            </div>
                            <div class="size80 bold opc2">{{ padZero(Number(index) + 1) }}</div>
                        </div>
                    </div>
                    <div class="line mt12 mb24"></div>
                    <div class="flex jb ac">
                        <div class="size24 bold5">{{ $t('社区业绩') }}</div>
                        <div class="size24 bold6">
                            <span v-init="item.total_kpi"></span>
                            <span class="ml5">{{ assetUSDT }}</span>
                        </div>
                    </div>
                </div>

            </div>
        </van-list>
    </van-pull-refresh>


</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusTitle from '@/components/CusTitle/index.vue'
import { assetUSDT } from '@/config';
import { padZero } from '@/utils';
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';

const { list, props: listProps, loadList } = useLoadList('/api/community/rank', 'list')
const { props } = usePullRefresh(loadList)
loadList()
</script>

<style lang="scss" scoped>
.bg {
    width: 690px;
    height: calc(100vh - 140px);
    height: calc(100dvh - 140px);
    background: linear-gradient(#C19F4F4D, #C19F4F00);
    border-radius: 20px;
    position: absolute;
    top: 140px;
    left: 30px;
}

.rank {
    padding: 20px 30px 30px 30px;
    border-radius: 20px;

    .avatarBox {
        width: 124px;
        height: 124px;
        position: relative;

        .avaterborder {
            width: 124px;
            height: 124px;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
        }

        .headimg {
            width: 92px;
            height: 92px;
            border-radius: 50%;
        }
    }

    .line {
        width: 100%;
        height: 1px;
    }
}

.rank1 {
    border: 2px solid #FFBB00;
    background-color: #88651F80;

    .line {
        background-color: #FFBB00;
    }
}

.rank2 {
    border: 2px solid #0099FF;
    background-color: #3A3E6980;

    .line {
        background-color: #0099FF;
    }
}

.rank3 {
    border: 2px solid #EB733C;
    background-color: #7D4D3780;

    .line {
        background-color: #EB733C;
    }
}

.rank4 {
    border: 2px solid #3C3C3C;
    background-color: #0B0B0B80;

    .line {
        background-color: #3C3C3C;
    }
}
</style>
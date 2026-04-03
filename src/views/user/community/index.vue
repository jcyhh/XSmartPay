<template>
    <CusNav :title="$t('全网社区')"></CusNav>

    <van-pull-refresh class="fullPage rel" v-bind="props">
        <van-list class="fullPage" v-bind="listProps">
            <div class="pl30 pr30 pt30 rel">
                <div class="box">
                    <CusTitle :title="$t('全网社区排行榜')"></CusTitle>
                    <div class="pl20 pr20 mt35">
                        <div class="pt15 pb15 flex jb ac" v-for="(item,index) in rankList" :key="index">
                            <div class="flex ac">
                                <img src="@/assets/user/26.png" class="img32 mr8" v-if="index==0">
                                <img src="@/assets/user/27.png" class="img32 mr8" v-else-if="index==1">
                                <img src="@/assets/user/28.png" class="img32 mr8" v-else-if="index==2">
                                <div class="flex jc ac img32 mr8 size24 opc5 bold" v-else>{{ index + 1 }}</div>
                                <div class="size24 bold">{{ item.email || item.address }}</div>
                            </div>
                            <div class="flex ac">
                                <div class="size24 bold mr10" v-init="item.total_kpi"></div>
                                <img src="@/assets/common/usdt.png" class="img24">
                            </div>
                        </div>
                    </div>

                    <div class="mainButton mt30 flex jc ac size26 bold6 btn" v-scale @click="routerPush('/community/rank')">
                        <img src="@/assets/user/29.png" class="img36 mr10">
                        <div>{{ $t('查看全部排行榜') }}</div>
                    </div>
                </div>
                <div class="cell card mb20 mt30" v-for="(item, index) in list" :key="index">
                    <div class="flex ac">
                        <img :src="item.logo" class="img100 avatar">
                        <div class="flex1">
                            <div class="flex jb ac">
                                <div class="size28 bold6 main">{{ item.name }}</div>
                                <div class="size24 bold6">{{ item.member_count }}/{{ item.community_max_num }}</div>
                            </div>
                            <div class="size24 opc5 mt10">{{ $t('创建人') }} {{ item.email || item.address }}</div>
                        </div>
                    </div>
                    <div class="line mt24 mb20"></div>
                    <div class="flex jb ac">
                        <div class="flex ac">
                            <img src="@/assets/user/21.png" class="img26 mr10">
                            <div class="size24 opc5 line1 desc">{{ item.desc }}</div>
                        </div>
                        <div class="mainButton btn flex ac main" v-scale @click="openAsk(item)">{{ $t('申请加入') }}</div>
                    </div>
                </div>
                <CusEmpty v-if="list?.length == 0"></CusEmpty>
            </div>
        </van-list>
    </van-pull-refresh>

    <CusAsk v-model:show="show" @submit="submit">{{ $t('确定要申请加入 {name} 吗？', { name: currentData?.name || '' }) }}</CusAsk>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue'
import CusAsk from '@/components/CusAsk/index.vue'
import { ref } from 'vue';
import { apiCommunityApply, apiCommunityRank } from '@/api/community';
import { message } from '@/utils/message';
import { t } from '@/locale';
import CusTitle from '@/components/CusTitle/index.vue'
import { routerPush } from '@/router';

const { list, props: listProps, loadList } = useLoadList('/api/community/rank', 'list')
const { props } = usePullRefresh(loadList)
loadList()

const rankList = ref<any[]>([])
const loadRank = async () => {
    const res:any = await apiCommunityRank({
        page_no: 1,
        page_size: 4
    })
    rankList.value = res.list
}
loadRank()

const currentData = ref()
const openAsk = (data:any) => {
    currentData.value = data
    show.value = true
}

const show = ref(false)
const submit = async () => {
    await apiCommunityApply({
        community_id: currentData.value?.id
    })
    message(t('申请已提交'), 'success')
    show.value = false
}
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
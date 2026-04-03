<template>
    <CusNav :title="$t('我的社区')">
        <div class="tr rel" v-if="info && isLeader">
            <span class="size26" @click="routerPush('/community/apply')">{{ $t('新成员') }}</span>
            <div class="dot" v-if="info?.has_pending"></div>
        </div>
    </CusNav>
    
    <div v-if="info">
        <div class="pl30 pr30 pt30 rel">

            <div class="top">
                <div class="tag size24 flex ac" v-if="info?.team_status==1">{{ $t('有效社团') }}</div>
                <div class="tag tag1 size24 flex ac" v-else>{{ $t('无效社团') }}</div>
                <div class="flex ac">
                    <img :src="info?.logo" class="img100 avatar">
                    <div class="flex1">
                        <div class="flex jb ac">
                            <div class="size28 bold6">{{ info?.name }}</div>
                            <div class="size24 bold6">{{ info?.member_count }}/{{ info?.community_max_num }}</div>
                        </div>
                        <div class="size24 opc5 mt10">{{ $t('创建人') }} {{ info?.email || info?.address }}</div>
                    </div>
                </div>
                <div class="line mt24 mb20"></div>
                <div class="flex ac">
                    <img src="@/assets/user/23.png" class="img26 mr10">
                    <div class="size24 opc5 line1 flex1">{{ info?.desc }}</div>
                </div>
            </div>

            <div class="flex mt30 size28 bold6">
                <div class="mainButton mainButtonDel flex jc ac main btn flex1" v-scale @click="showDestory=true" v-if="isLeader">{{ $t('解散社团') }}</div>
                <div class="mainButton mainButtonDel flex jc ac main btn flex1" v-scale @click="showQuit=true" v-else>{{ $t('退出社团') }}</div>
            </div>


            <div class="mainCard mt40">
                <div class="flex">
                    <div class="flex1">
                        <div class="flex ac">
                            <img src="@/assets/user/24.png" class="img32 mr10">
                            <div class="size24 opc5">{{ $t('社区总业绩') }}</div>
                        </div>
                        <div class="size40 bold main mt30">
                            <CusNumber :amount="info?.total_kpi" sizeClass="size24"></CusNumber>
                        </div>
                        <div class="flex mt30">
                            <div class="ccy flex ac">
                                <img src="@/assets/common/usdt.png" class="img32 mr10">
                                <div class="size24">{{ assetUSDT }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex1">
                        <div class="flex ac">
                            <img src="@/assets/user/25.png" class="img32 mr10">
                            <div class="size24 opc5">{{ $t('社区当日业绩') }}</div>
                        </div>
                        <div class="size40 bold green mt30 flex ac">
                            +<CusNumber :amount="info?.kpi" sizeClass="size24"></CusNumber>
                        </div>
                        <div class="flex mt30">
                            <div class="ccy flex ac">
                                <img src="@/assets/common/usdt.png" class="img32 mr10">
                                <div class="size24">{{ assetUSDT }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>

            <div class="gap40"></div>
            <Member :isLeader="isLeader" :leaderId="info?.user_id"></Member>
        </div>
    </div>
    <div class="pl30 pr30 rel" v-else>
        <CusEmpty></CusEmpty>
        <div class="size24 opc5 tc">{{ $t('您还未创建社区...') }}</div>
        <div class="safeArea"></div>
        <div class="gap130"></div>
        <div class="bottom">
            <div class="mainBtn size28 bold6 flex jc ac" @click="show = true">{{ $t('创建社区') }}</div>
            <div class="safeArea"></div>
        </div>
    </div>

    <Create v-model:show="show" @success="loadData()"></Create>

    <CusAsk v-model:show="showQuit" @submit="submitQuit">{{ $t('确定要退出社区吗？') }}</CusAsk>

    <CusAsk v-model:show="showDestory" @submit="submitDestory">{{ $t('确定要解散社区吗？') }}</CusAsk>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusNumber from '@/components/CusNumber/index.vue'
import Member from '../components/Member.vue';
import { assetUSDT } from '@/config';
import { routerGo, routerPush } from '@/router';
import { apiCommunityDistory, apiCommunityQuit, apiMyCommunity } from '@/api/community';
import { onMounted, ref } from 'vue';
import CusEmpty from '@/components/CusEmpty/index.vue'
import Create from '../components/Create.vue';
import { message } from '@/utils/message';
import CusAsk from '@/components/CusAsk/index.vue'
import { t } from '@/locale';

const info = ref()

const show = ref(false)
const showQuit = ref(false)
const showDestory = ref(false)
const isLeader = ref(true)

const loadData = async () => {
    const res: any = await apiMyCommunity()
    if (res && JSON.stringify(res) != '[]') {
        info.value = res
        isLeader.value = res.is_creator
    }else info.value = null
}

const submitQuit = async () => {
    await apiCommunityQuit()
    message(t('退出成功'), 'success')
    routerGo()
}

const submitDestory = async () => {
    await apiCommunityDistory()
    message(t('解散成功'), 'success')
    routerGo()
}

onMounted(() => {
    loadData()
})
</script>

<style lang="scss" scoped>
.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: $red;
    position: absolute;
    top: 0px;
    right: -6px;
    z-index: 1;
}

.top {
    background: linear-gradient(140.58deg, #FFE7AB 5.95%, #D3AC61 94.05%);
    border-radius: 20px;
    padding: 30px;
    color: #000000;
    position: relative;

    .tag {
        background: linear-gradient(90deg, #5CC751 0%, #11B700 100%);
        border-radius: 25px 0 0 25px;
        height: 50px;
        padding: 0 30px 0 26px;
        color: #FFFFFF;
        position: absolute;
        right: 0;
        bottom: 64px;
        z-index: 1;
    }

    .tag1 {
        background: #000000;
    }

    .avatar {
        border-radius: 16px;
        margin-right: 20px;
    }

    .line {
        width: 100%;
        height: 1px;
        background-color: #00000033;
    }
}

.btn {
    height: 88px;
    border-radius: 44px;
}

.ccy {
    height: 48px;
    border-radius: 24px;
    background-color: #FFFFFF1A;
    padding: 0 12px;
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
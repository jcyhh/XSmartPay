<template>
    <CusNav :title="$t('团队')" :show-bg="false"></CusNav>

    <div class="pl30 pr30 pt30">
        
        <div class="flex jb ac">
            <div class="size24 gray">{{ $t('我的邮箱') }}</div>
            <div class="flex ac tag">
                <img :src="userInfo?.level.icon" class="img24">
                <div class="size24 bold6 ml10">{{ userInfo?.level.name }}</div>
            </div>
        </div>
        <div class="flex jb ac mt10">
            <div class="size28 bold" v-init:address="userInfo?.email || userInfo?.address"></div>
            <div class="size24 gray" v-if="userInfo?.upgrade_level">{{ $t('当前等级') }}</div>
            <div class="size24 gray" v-if="userInfo && !userInfo?.upgrade_level">{{ $t('已是最高等级') }}</div>
        </div>
        <div v-if="userInfo?.upgrade_level">
            <div class="flex jb ac mt10 mt40 mb20">
                <div class="size24 bold6">{{ $t('升级') }} {{ userInfo?.upgrade_level?.name }} {{ $t('条件') }}</div>
                <div class="size22 main bold6">
                    <span v-init="userInfo?.team_kpi"></span>
                    <span class="ml5 mr5">/</span>
                    <span v-init="userInfo?.upgrade_level.kpi"></span>
                    <span class="ml5">{{ assetUSDT }}</span>
                </div>
            </div>

            <div class="progressBox">
                <CusProgress :progress="getPercent(userInfo?.team_kpi, userInfo?.upgrade_level.kpi)"></CusProgress>
            </div>

            <div class="size24 mt12">
                <span class="opc5 mr5">{{ $t('还需') }}</span>
                <span v-init="computedSub(userInfo?.upgrade_level?.kpi, userInfo?.team_kpi)"></span>
                <span class="opc5 ml5">{{ $t('团队业绩') }}</span>
            </div>
        </div>
        

        <div class="card mt30">
            <div class="flex ac">
                <div class="flex1 tc">
                    <div class="size40 bold">{{ userInfo?.team_count }}</div>
                    <div class="size24 opc5 mt10">{{ $t('团队总人数') }}</div>
                </div>
                <img src="@/assets/user/13.png" class="img86">
                <div class="flex1 tc">
                    <div class="size40 bold">{{ userInfo?.referral_count }}</div>
                    <div class="size24 opc5 mt10">{{ $t('直推人数') }}</div>
                </div>
            </div>
            <div class="line mt30"></div>
            <div class="flex jb ac mt30">
                <div class="flex ac">
                    <img src="@/assets/user/14.png" class="img28 mr10">
                    <div class="size24 opc5">{{ $t('团队业绩') }}</div>
                </div>
                <div class="size24">
                    <span v-init="userInfo?.team_kpi"></span>
                    <span class="ml5">{{ assetUSDT }}</span>
                </div>
            </div>
            <div class="flex jb ac mt30">
                <div class="flex ac">
                    <img src="@/assets/user/15.png" class="img28 mr10">
                    <div class="size24 opc5">{{ $t('个人业绩') }}</div>
                </div>
                <div class="size24">
                    <span v-init="userInfo?.kpi"></span>
                    <span class="ml5">{{ assetUSDT }}</span>
                </div>
            </div>
            <div class="flex jb ac mt30">
                <div class="flex ac">
                    <img src="@/assets/user/16.png" class="img28 mr10">
                    <div class="size24 opc5">{{ $t('团队新增业绩') }}</div>
                </div>
                <div class="size24">
                    <span v-init="userInfo?.new_team_kpi"></span>
                    <span class="ml5">{{ assetUSDT }}</span>
                </div>
            </div>
        </div>

        <div class="mainCard mt20">
            <div class="size24 opc5">{{ $t('邀请码') }}</div>
            <div class="flex mt20">
                <div class="flex ac" v-copy="userInfo?.referral_code">
                    <div class="code size32 bold">{{ userInfo?.referral_code }}</div>
                    <img src="@/assets/user/17.png" class="img26 ml10">
                </div>
            </div>
            <div class="flex jb ac mt20">
                <div class="size24 opc5">{{ $t('邀请链接') }}</div>
                <img src="@/assets/user/17.png" class="img26" v-copy="inviteLink">
            </div>
            <div class="br size26 lh40 mt20">{{ inviteLink }}</div>
        </div>

        <div class="size34 bold6 mt30 mb24">{{ $t('社区列表') }}</div>

        <van-list v-bind="listProps">
            <div class="cell mb12" v-for="(item,index) in list" :key="index">
                <div class="gap10"></div>
                <div class="flex jb ac">
                    <div class="size28 bold6" v-init:address="item.email || item.address"></div>
                    <div class="size26 bold main">
                        <span v-init="item.kpi"></span>
                        <span>{{ assetUSDT }}</span>
                    </div>
                </div>
                <div class="flex jb ac mt20">
                    <div class="size24 opc5 bold5">{{ item.created_at }}</div>
                    <div class="flex ac tag">
                        <img :src="item?.level?.icon" class="img24">
                        <div class="size24 bold6 ml10">{{ item?.level?.name }}</div>
                    </div>
                </div>
                <div class="gap10"></div>
            </div>
            <CusEmpty v-if="list?.length==0"></CusEmpty>
        </van-list>
        
    </div>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { assetUSDT } from '@/config';
import CusProgress from '@/components/CusProgress/index.vue'
import { computedSub, getPercent } from '@/utils';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store';
import { computed } from 'vue';
import { useLoadList } from '@/hooks/useLoadList';
import CusEmpty from '@/components/CusEmpty/index.vue'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

userStore.loadUserInfo()

const inviteLink = computed(()=>`${window.origin}/ref/${userInfo.value?.referral_code}`)

const { list, props: listProps, loadList } = useLoadList('/api/users/my/referrals', 'referrals')
loadList()
</script>

<style lang="scss" scoped>
.tag{
    height: 48px;
    border-radius: 24px;
    padding: 0 12px;
    background-color: #0000001A;
    border: 1px solid rgba($color: #FFFFFF, $alpha: 0.5);
}
.card{
    background: linear-gradient(100.27deg, #D3AC61 7.67%, #FFE7AB 28.43%, #D3AC61 92.33%);
    border-radius: 16px;
    padding: 30px;
    color: #000000;
    .line{
        width: 100%;
        height: 1px;
        background-color: #0000001A;
    }
}
.progressBox{
    height: 20px;
    border-radius: 10px;
}
.code{
    display: inline-block;
    background: linear-gradient(281.88deg, #FFF1BF 24.66%, #FFF1BF 37.09%, #FFCD48 39.28%, #FFF1BF 59.99%, #FFCD48 64.38%, #FFF1BF 75.34%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}
</style>
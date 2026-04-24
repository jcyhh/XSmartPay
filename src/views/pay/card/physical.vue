<template>
    <CusNav :title="$t('实体卡')" :show-bg="false"></CusNav>

    <div v-if="cardList.length==0">
        <div class="pl30 pr30 pt30 flex">
            <div class="card flex1 flex col ac mr20" @click="routerPush('/physical/apply')">
                <img src="@/assets/pay/6.png" class="img46">
                <div class="size28 main mt8">{{ $t('申请实体卡') }}</div>
            </div>
            <div class="card flex1 flex col ac" @click="routerPush('/physical/bind')">
                <img src="@/assets/pay/5.png" class="img46">
                <div class="size28 main mt8">{{ $t('绑定实体卡') }}</div>
            </div>
        </div>
    </div>

    <div class="pl30 pr30 pt30 rel" v-else>
        
        <div class="mainCard rel">
            <div class="flex jb ac">
                <div class="size34 bold5 main">{{ appName }} {{ $t('实体卡') }}</div>
                <img src="@/assets/pay/2.png" class="img40" @click="refresh">
            </div>
            
            <div class="cardSwiperWrap">
                <swiper
                    class="cardSwiper"
                    :slides-per-view="'auto'"
                    :space-between="space"
                    :centered-slides="true"
                    @slide-change="onSlideChange"
                >
                    <swiper-slide v-for="item in cardList" :key="item.id" class="cardSlide">
                        <div class="cardBlock">
                            <img src="@/assets/card/physicalCard.png" class="cardImg">
                            <div class="active" v-if="item.card_status == 'PENDING'" @click="activeRef?.open(currentCard?.id)">{{ $t('点击激活') }}</div>
                            <div v-else>
                                <div class="tag" :class="item.card_status=='ACTIVE'?'':'tagfail'" v-if="item.card_status">{{ item.card_status }}</div>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>

            <div class="gap200"></div>
            <div class="gap200"></div>

            <div class="flex jb ac mt30">
                <div class="flex ac">
                    <div class="size32 mr12">{{ appName }} {{ $t('实体卡') }}</div>
                    <img src="@/assets/login/eyeOpen.png" class="img30 animate__animated animate__zoomIn ani5" @click="show=false" v-if="show">
                    <img src="@/assets/login/eyeClose.png" class="img30" @click="show=true" v-else>
                </div>
                <div class="flex">
                    <div class="price bold">
                        <span class="size48" v-init="currentCard?.available_balance" v-if="show"></span>
                        <span class="size48" v-else>****</span>
                        <span class="size28 ml10">{{ currentCard?.card_currency }}</span>
                    </div>
                </div>
            </div>

            <div class="flex jb ac mt20">
                <div class="flex ac" v-if="currentCard?.complete_card_number" v-copy="currentCard?.complete_card_number">
                    <div class="size30 bold6 main">{{ show ? currentCard?.complete_card_number : currentCard?.card_number }}</div>
                    <img src="@/assets/card/copy.png" class="img32 ml10">
                </div>
                <div class="size30 bold6 main" v-else>**** **** **** ****</div>
                <div class="size24 opc5">{{ $t('卡片金额') }}</div>
            </div>

            <div class="mt20 flex ac jb">
                <div class="flex ac">
                    <div class="size20 opc5">EXP DATE</div>
                    <div class="size28 ml10">{{ show ? (currentCard.expire_date || '***') : '***' }}</div>
                    <div class="size20 opc5 ml30">CVV NUM</div>
                    <div class="size28 ml10">{{ show ? (currentCard.cvv || '***') : '***' }}</div>
                </div>

                <div class="flex ac" v-if="currentCard.card_status == 'ACTIVE'">
                    <div class="size30 bold main" @click="routerPush(`/setcard/${currentCard?.id}`)">{{ currentCard?.complete_card_number ? t('编辑') : t('绑定') }}</div>
                    <img src="@/assets/card/8.png" class="img36 ml5">
                </div>
                
            </div>

            <div class="flex ac mt40 size28 bold6 main">
                <div class="flex1 mainButton btn flex jc ac" v-scale @click="rechargeRef?.open()">
                    <img src="@/assets/user/3.png" class="img40 mr10">
                    <div>{{ $t('充值') }}</div>
                </div>
                <div class="flex1 mainButton btn flex jc ac ml15 mr15" v-scale @click="transferRef?.open()">
                    <img src="@/assets/pay/3.png" class="img40 mr10">
                    <div>{{ $t('转账') }}</div>
                </div>
                <div class="flex1 mainButton btn flex jc ac" v-scale @click="passwordRef?.open()">
                    <img src="@/assets/pay/4.png" class="img40 mr10">
                    <div>{{ $t('密码') }}</div>
                </div>
            </div>
            <div class="gap10"></div>
        </div>

        <div class="flex mt40">
            <div class="card flex1 flex col ac mr20" @click="routerPush('/physical/apply')">
                <img src="@/assets/pay/6.png" class="img46">
                <div class="size28 main mt8">{{ $t('申请实体卡') }}</div>
            </div>
            <div class="card flex1 flex col ac" @click="routerPush('/physical/bind')">
                <img src="@/assets/pay/5.png" class="img46">
                <div class="size28 main mt8">{{ $t('绑定实体卡') }}</div>
            </div>
        </div>

        <div class="size34 main bold6 mt40 mb24">{{ $t('流水明细') }}</div>

        <van-list v-bind="listProps">
            <div class="cell mb12" v-for="(item,index) in list" :key="index">
                <div class="gap10"></div>
                <div class="flex jb ac">
                    <div class="size28">{{ item.type_text }}</div>
                    <div class="size28 bold" :class="item.is_inc ? 'green' : 'red'">
                        <span>{{ item.is_inc ? '+' : '-' }}</span>
                        <span v-init="item.amount"></span>
                        <span>{{ item.currency }}</span>
                    </div>
                </div>
                <div class="size24 opc5 mt20">{{ item.created_at }}</div>
                <div class="gap10"></div>
            </div>
            <CusEmpty v-if="list?.length==0"></CusEmpty>
        </van-list>

    </div>

    <Recharge @success="loadCard()" ref="rechargeRef"></Recharge>
    <Transfer ref="transferRef"></Transfer>
    <Password ref="passwordRef"></Password>
    <Active ref="activeRef"></Active>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { appName } from '@/config';
import { getAdaptPx } from '@/utils';
import { Swiper, SwiperSlide } from 'swiper/vue';
// @ts-ignore
import 'swiper/css';
import { computed, onMounted, ref } from 'vue';
import { apiGetCardList, apiRefreshCard } from '@/api/card';
import { useLoadList } from '@/hooks/useLoadList';
import CusEmpty from '@/components/CusEmpty/index.vue'
import { message } from '@/utils/message';
import { t } from '@/locale';
import { useDappStore } from '@/store';
import { storeToRefs } from 'pinia';
import Recharge from '../components/Recharge.vue';
import Transfer from '../components/Transfer.vue';
import Password from '../components/Password.vue';
import Active from '../components/Active.vue';
import { routerPush } from '@/router';

const dappStore = useDappStore()
const { dappLoading } = storeToRefs(dappStore)

const space = getAdaptPx(30)

const rechargeRef = ref()
const transferRef = ref()
const passwordRef = ref()
const activeRef = ref()

const cardList = ref<any[]>([])
const currentIndex = ref(0)
const currentCard = computed(() => cardList.value[currentIndex.value] ?? null)

const params = computed(()=>({card_id: currentCard.value?.id}))
const { list, props: listProps, loadList } = useLoadList('/api/card/balance-logs', 'data', params)

const onSlideChange = (swiper: any) => {
    currentIndex.value = Number(swiper?.realIndex ?? swiper?.activeIndex ?? 0)
    loadList()
}

const loadCard = async () => {
    const res:any = await apiGetCardList({
        card_type: 2,
        pay_status: 2
    })
    cardList.value = res.data ?? []
    currentIndex.value = 0
    if(cardList.value.length>0)loadList()
}

const refresh = async () => {
    try {
        dappLoading.value = true
        await apiRefreshCard({
            card_id: currentCard.value.id
        })
        loadCard()
        message(t('刷新成功'), 'success')
        dappLoading.value = false
    } catch (error) {
        dappLoading.value = false
    }
}

const show = ref(false)

onMounted(()=>{
    loadCard()
})
</script>

<style lang="scss" scoped>
.cardSwiperWrap{
    width: 100vw;
    overflow: hidden;
    position: absolute;
    top: 78px;
    left: -30px;
    z-index: 1;
}
.cardSwiper{
    width: 100vw;
    overflow: visible;
}
.cardSlide{
    width: 590px;
}
.cardBlock{
    width: 590px;
    height: 440px;
    padding-top: 40px;
    position: relative;
    .cardImg{
        width: 590px;
        height: 354px;
    }
    .tag{
        height: 34px;
        border-radius: 17px;
        padding: 0 10px;
        font-size: 20px;
        line-height: 34px;
        font-weight: bold;
        background-color: $green;
        position: absolute;
        top: 65px;
        right: 30px;
        z-index: 1;
    }
    .active{
        height: 34px;
        border-radius: 17px;
        padding: 0 10px;
        font-size: 20px;
        line-height: 34px;
        font-weight: bold;
        border: 1px solid $main-color;
        color: $main-color;
        position: absolute;
        top: 65px;
        right: 30px;
        z-index: 1;
    }
    .tagfail{
        background-color: $red;
    }
}
.price{
    display: inline-block;
    background: linear-gradient(281.88deg, #FFF1BF 24.66%, #FFF1BF 37.09%, #FFCD48 39.28%, #FFF1BF 59.99%, #FFCD48 64.38%, #FFF1BF 75.34%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}
.btn{
    height: 88px;
    border-radius: 44px;
}
.card{
    border-radius: 30px;
    padding: 30px;
    background: linear-gradient(#FFE5A51F, #FFE5A500);
    border: 1px solid transparent;
    border-bottom: none;
    position: relative;
    &::before{
        content: '';
        position: absolute;
        z-index: -1;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border-radius: 30px;
        background: linear-gradient(#8F8F8F, #8F8F8F00);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: xor;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        padding: 1px;
    }
}
</style>
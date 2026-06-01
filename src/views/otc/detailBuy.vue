<template>
    <CusNav :title="$t('订单详情')"></CusNav>

    <div class="pl30 pr30 pt30 rel">
        
        <div class="inp flex jb ac size24">
            <div>订单状态</div>
            <div class="green">待买方确认</div>
        </div>

        <div class="mainCard mt30">
            <div class="flex jb ac">
                <div class="opc5">购买总价</div>
                <div>
                    <span v-init="1000"></span>
                    <span class="ml5">CNY</span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">交易单价</div>
                <div>
                    <span>¥</span>
                    <span v-init="1000"></span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">交易数量</div>
                <div>
                    <span v-init="1000"></span>
                    <span class="ml5">{{ assetUSDT }}</span>
                </div>
            </div>
        </div>

        <div class="mainCard mt30 pay">
            <div class="size28">支付方式</div>
            <div class="flex ac mt28 mb26">
                <div class="line bank"></div>
                <div class="size26 ml10">银行卡</div>
            </div>
            <div class="flex jb ac size26">
                <div class="opc5">持卡人姓名</div>
                <div>姓名</div>
            </div>
            <div class="flex jb ac size26 mt20">
                <div class="opc5">卡号</div>
                <div class="flex ac">
                    <div>111111111</div>
                    <img src="@/assets/otc/5.png" class="img24 ml10">
                </div>
            </div>
            <div class="flex ac mt28 mb26">
                <div class="line alipay"></div>
                <div class="size26 ml10">支付宝</div>
            </div>
            <div class="flex jb ac size26">
                <div class="opc5">持卡人姓名</div>
                <div>姓名</div>
            </div>
            <div class="flex ac mt28 mb26">
                <div class="line wechat"></div>
                <div class="size26 ml10">微信</div>
            </div>
            <div class="flex jb ac size26">
                <div class="opc5">持卡人姓名</div>
                <div>姓名</div>
            </div>
        </div>

        <div class="card mt30 flex jb ast">
            <div class="flex col jb">
                <div>
                    <div class="size28">支付凭证</div>
                    <div class="size24 opc5 mt10">请上传清晰的图片</div>
                </div>
                <div class="size24 main">点击图片查看大图</div>
            </div>
            <div>
                <img src="@/assets/otc/6.png" class="img160">
            </div>
        </div>
        
        <div class="flex jb ac mt20">
            <div class="flex ac">
                <div class="mr10 size28 red">付款倒计时</div>
                <van-count-down :time="86600 * 1000">
                    <template #default="timeData">
                        <span class="red size28" v-if="timeData.days>0">{{ padZero(timeData.days) }}</span>
                        <span class="red size28" v-if="timeData.days>0">:</span>
                        <span class="red size28" v-if="timeData.hours>0">{{ padZero(timeData.hours) }}</span>
                        <span class="red size28" v-if="timeData.hours>0">:</span>
                        <span class="red size28">{{ padZero(timeData.minutes) }}</span>
                        <span class="red size28">:</span>
                        <span class="red size28">{{ padZero(timeData.seconds) }}</span>
                    </template>
                </van-count-down>
            </div>
            <div class="size24">
                <span>对此订单有疑惑？</span>
                <span class="red" @click="routerPush('/otc/appeal')">点击申诉</span>
            </div>
        </div>

        <div class="mainButton mt40 btn flex jc ac main">确认已支付</div>

        <div class="cancelBtn flex jc ac mt30">取消订单</div>

        <div class="gap100"></div>

    </div>

    <CusAsk v-model:show="showCancel" title="取消订单">
        <div class="size28">确认取消此订单吗？</div>
    </CusAsk>

    <CusAsk v-model:show="showConfirm" title="确认已支付">
        <div class="size28">请确认已向卖家付款！</div>
        <div class="size28 red mt10">如果恶意标记打款订单，可能会被封号处理</div> 
    </CusAsk>

    <CusAsk v-model:show="showPayConfirm" title="确认已支付">
        <div class="size28">请确认买家已向您打款！</div>
    </CusAsk>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { assetUSDT } from '@/config';
import { padZero } from '@/utils';
import { ref } from 'vue';
import CusAsk from '@/components/CusAsk/index.vue'
import { routerPush } from '@/router';

const showCancel = ref(false)

const showConfirm = ref(false)

const showPayConfirm = ref(false)
</script>

<style lang="scss" scoped>
.card{
    background-color: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    padding: 30px;
    border-radius: 20px;
}
.btn{
    height: 88px;
    border-radius: 44px;
    font-size: 28px;
}
.cancelBtn{
    background-color: #FFFFFF1A;
    border: 1px solid #FFFFFF33;
    height: 88px;
    border-radius: 44px;
    font-size: 28px;
}
</style>
<template>
    <CusNav :title="$t('订单详情')"></CusNav>

    <div class="pl30 pr30 pt30 rel">

        <div class="mainCard size26 mb30">
            <div class="flex jb ac">
                <div class="opc5">委托单号</div>
                <div>CC12345678910</div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">交易单价</div>
                <div>
                    <span>¥</span>
                    <span v-init="1000"></span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">交易限额</div>
                <div>
                    <span v-init="1000"></span>
                    <span class="ml5 mr5">CNY</span>
                    <span>-</span>
                    <span class="ml5 mr5" v-init="1000"></span>
                    <span>CNY</span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">交易数量</div>
                <div>
                    <span v-init="1000"></span>
                    <span class="ml5">{{ assetUSDT }}</span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">交易总额</div>
                <div>
                    <span v-init="1000"></span>
                    <span class="ml5">{{ assetUSDT }}</span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">已交易数量</div>
                <div>
                    <span v-init="1000"></span>
                    <span class="ml5">{{ assetUSDT }}</span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">已交易总额</div>
                <div>
                    <span>¥</span>
                    <span v-init="1000"></span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">支付方式</div>
                <div class="flex ac pay size22">
                    <div class="line bank"></div>
                    <div class="ml10 mr30">银行卡</div>
                    <div class="line wechat"></div>
                    <div class="ml10 mr30">微信</div>
                    <div class="line alipay"></div>
                    <div class="ml10">支付宝</div>
                </div>
            </div>
        </div>

        <div class="card mb20" v-for="(item,index) in 10" :key="index">
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
        </div>

    </div>
    
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { assetUSDT } from '@/config';
</script>

<style lang="scss" scoped>
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
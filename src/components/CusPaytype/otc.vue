<template>
    <div class="paytype flex jb ac" @click="onChoose('bank')">
        <div class="flex ac">
            <div class="line bank mr10"></div>
            <div class="size28 bold6">银行卡</div>
        </div>
        <div class="flex ac">
            <img src="@/assets/user/30.png" class="img32 animate__animated animate__zoomIn ani3" v-if="isSelected('bank')">
            <img src="@/assets/user/31.png" class="img32" v-else>
        </div>
        <!-- <div class="flex ac size24">
            <div class="red">未绑定</div>
            <div class="ml10 mr10">前往绑定</div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div> -->
    </div>

    <div class="paytype flex jb ac" @click="onChoose('alipay')">
        <div class="flex ac">
            <div class="line alipay mr10"></div>
            <div class="size28 bold6">支付宝</div>
        </div>
        <div class="flex ac">
            <img src="@/assets/user/30.png" class="img32 animate__animated animate__zoomIn ani3" v-if="isSelected('alipay')">
            <img src="@/assets/user/31.png" class="img32" v-else>
        </div>
        <!-- <div class="flex ac size24">
            <div class="red">未绑定</div>
            <div class="ml10 mr10">前往绑定</div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div> -->
    </div>

    <div class="paytype flex jb ac" @click="onChoose('wechat')">
        <div class="flex ac">
            <div class="line wechat mr10"></div>
            <div class="size28 bold6">微信</div>
        </div>
        <div class="flex ac">
            <img src="@/assets/user/30.png" class="img32 animate__animated animate__zoomIn ani3" v-if="isSelected('wechat')">
            <img src="@/assets/user/31.png" class="img32" v-else>
        </div>
        <!-- <div class="flex ac size24">
            <div class="red">未绑定</div>
            <div class="ml10 mr10">前往绑定</div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

const props = withDefaults(defineProps<{
    multiple?: boolean
}>(), {
    multiple: false
})

const paytype = defineModel<string | string[]>('paytype', { default: 'bank' })

const selectedList = computed(() => {
    if (Array.isArray(paytype.value)) return paytype.value
    if (typeof paytype.value === 'string' && paytype.value) return [paytype.value]
    return []
})

const isSelected = (value: string) => selectedList.value.includes(value)

const onChoose = (value: string) => {
    if (props.multiple) {
        const next = [...selectedList.value]
        const index = next.indexOf(value)

        if (index > -1) {
            next.splice(index, 1)
        } else {
            next.push(value)
        }

        paytype.value = next
        return
    }

    if (paytype.value === value) return
    paytype.value = value
}

watch(() => props.multiple, (multiple) => {
    if (multiple) {
        if (!Array.isArray(paytype.value)) {
            paytype.value = selectedList.value.length > 0 ? [...selectedList.value] : []
        }
        return
    }

    if (Array.isArray(paytype.value)) {
        paytype.value = paytype.value[0] || 'bank'
    }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.paytype{
    height: 70px;
    .line{
        width: 4px;
        height: 18px;
        border-radius: 2px;
    }
    .bank{
        background-color: #EFB85E;
    }
    .wechat{
        background-color: #0CC76D;
    }
    .alipay{
        background-color: #019CEB;
    }
}
</style>
<template>
    <div @click="submit">{{ isWaiting ? count : $t('发送验证码') }}</div>
</template>

<script setup lang="ts">
import { apiSendEmailCode } from '@/api/login';
import { t } from '@/locale';
import { message } from '@/utils/message';
import { onUnmounted, ref } from 'vue';

const props = defineProps(['account', 'type'])

let timer:any = null

const count = ref(60)

const isWaiting = ref(false)

const submit = async () => {
    if(!props.account)return message(t('请输入邮箱'))

    if(isWaiting.value)return
    isWaiting.value = true

    try {
        await apiSendEmailCode({
            email: props.account,
            type: props.type
        })

        message(t('发送成功'))

        count.value = 60
        timer = setInterval(() => {
            count.value--
            if(count.value <= 0){
                clearInterval(timer)
                timer = null
                isWaiting.value = false
            }
        }, 1000);
        
    } catch (error) {
        isWaiting.value = false
    }
}

onUnmounted(()=>{
    if(timer){
        clearInterval(timer)
        timer = null
    }
})
</script>

<style lang="scss" scoped>

</style>
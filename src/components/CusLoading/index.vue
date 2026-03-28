<template>
    <div class="animate__animated animate__fadeIn cusLoading" v-if="modelValue">
        <div class="loading-box" :transition-style="show ? '' : 'out:circle:center'">
            <div class="loading">
                <span :style="`--i: ${i}`" v-for="i in 7" :key="i"></span>
            </div>

            <svg>
                <filter id="gooey">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
                    <feColorMatrix values="
                        1 0 0 0 0 
                        0 1 0 0 0
                        0 0 1 0 0 
                        0 0 0 20 -10
                        " />
                </filter>
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps(['modelValue'])

const emits = defineEmits(['update:modelValue'])

const show = ref(false)

watch(() => props.modelValue, (newVal) => {
    if (newVal) show.value = true
    else setTimeout(() => show.value = false, 800)
})
</script>

<style lang="scss" scoped>
.cusLoading{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000000;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
}
.loading-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    svg {
        width: 0;
        height: 0;
    }

    .loading {
        position: relative;
        width: 300px;
        height: 300px;
        filter: url("#gooey");
    }

    .loading span {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 100%;
        height: 100%;
        animation: loading 3s ease-in-out infinite;

        /* var函数用来插入css变量的值，css变量名称以--开头 */
        animation-delay: calc(0.2s * var(--i));
    }

    .loading span::before {
        position: absolute;
        top: 0;
        left: calc(50% - 28px);
        width: 56px;
        height: 56px;
        content: "";
        background-image: linear-gradient(to right, #50D6FC, #1989F5);
        border-radius: 50%;
        box-shadow: 0 0 30px #152535;
    }

    @keyframes loading {
        0% {
            transform: rotate(0deg);
        }

        50%,
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes circle-out-center {
        0% {
            clip-path: circle(125% at 50% calc(50vh - 150px + 28px));
        }

        100% {
            clip-path: circle(0% at 50% calc(50vh - 150px + 28px));
        }
    }

    &[transition-style="out:circle:center"] {
        animation-name: circle-out-center;
    }
}
</style>
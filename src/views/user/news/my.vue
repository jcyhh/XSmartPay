<template>
    <CusNav :title="$t('我的发布')" :show-bg="false"></CusNav>
    <van-pull-refresh class="fullPage rel" v-bind="props">
        <van-list class="fullPage" v-bind="listProps">
            <div class="pl30 pr30 pt30">
        
                <div class="cell card mb24" v-for="(item,index) in list" :key="index" @click="routerPush(`/news/${item.id}`)">
                    <div class="flex">
                        <div class="flex1 mr30">
                            <div class="line1 size30 bold6">{{ item.title }}</div>
                            <div class="line1 size24 opc5 mt20">{{ item.content }}</div>
                        </div>
                        <img :src="item?.images[0]" class="img130 cover flex0" v-if="item?.images && item.images.length>0">
                        <div class="img130 flex0" v-else></div>
                    </div>
                    <div class="size24 mt6">{{ $t('来自') }} {{ item.email || item.address }}</div>
                    <div class="flex jb ac mt10">
                        <div class="flex ac">
                            <img src="@/assets/user/20.png" class="img34 mr6">
                            <div class="size20 opc5 mr10">{{ item.community_name }}</div>
                            <div class="size20 main">{{ $t('NO.') }}{{ item.community_rank }}</div>
                        </div>
                        <div class="flex ac">
                            <div class="size22 opc5">{{ $t('{count}人评论', { count: item.comment_count }) }}</div>
                            <div class="line ml16 mr16"></div>
                            <img src="@/assets/user/36.png" class="img24">
                        </div>
                    </div>
                </div>
                <CusEmpty v-if="list?.length==0"></CusEmpty>
            </div>
        </van-list>
    </van-pull-refresh>
    <img src="@/assets/user/39.png" class="create" @click="routerPush('/news/create')">
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { routerPush } from '@/router';
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue'

const { list, props: listProps, loadList } = useLoadList('/api/forum/my/posts', 'posts')
const { props } = usePullRefresh(loadList)
loadList()
</script>

<style lang="scss" scoped>
.card{
    border-radius: 20px;
    padding: 30px;
    &::before{
        border-radius: 20px;
    }
    .cover{
        border-radius: 10px;
        object-fit: cover;
    }
    .line{
        width: 1px;
        height: 20px;
        background-color: #FFFFFF33;
    }
}
.create{
    width: 92px;
    height: 92px;
    position: fixed;
    bottom: 60px;
    right: 20px;
    z-index: 10;
}
</style>
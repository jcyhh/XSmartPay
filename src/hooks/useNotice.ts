import { apiGet } from '@/utils/request';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

export function useNotice () {
    const noticeList = ref<any[]>([])

    const noticeDetail = ref()

    const showNoticePop = ref(false)
    const noticePopInfo = ref()

    const loadNotice = () => {
        apiGet('/api/notices',{
            page_no: 1,
            page_size: 5
        }).then((res:any)=>noticeList.value=res.notices)
    }

    const loadNoticeDetail = () => {
        const { params } = useRoute()
        if(!params?.id)return
        apiGet(`/api/notices/${params?.id}`).then(res=>noticeDetail.value=res)
    }

    const loadNoticePop = () => {
        apiGet('/api/notices/pop').then((res:any)=>{
            if(res.is_show){
                noticePopInfo.value = res.notice
                showNoticePop.value = true
            }
        })
    }

    const readNotice = () => apiGet(`/api/notices/${noticePopInfo.value?.id}/read`).then(()=>showNoticePop.value=false)

    return {
        noticeList,         // 公告列表
        noticeDetail,       // 公告详情
        showNoticePop,      // 弹窗公告是否弹出
        noticePopInfo,      // 弹窗公告信息

        loadNotice,         // 请求轮播公告
        loadNoticeDetail,   // 请求公告详情
        loadNoticePop,      // 请求弹窗公告
        readNotice          // 弹窗公告，已读操作
    }
}
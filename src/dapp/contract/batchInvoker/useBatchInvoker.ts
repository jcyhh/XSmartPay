import { encodeFunctionData, type Address, type Abi } from 'viem'
import { t } from '@/locale'
import { getClients, currentChain } from '@/dapp'
import { useDappStore } from '@/dapp/store'
import { message } from '@/utils/message'

// 调用项类型
export interface BatchCall {
    to: Address
    abi: Abi
    functionName: string
    args: any[]
}

/**
 * 通用批量调用
 * @param calls 调用数组 [{ to, abi, functionName, args }, ...]
 * @param showLoading 是否显示 loading
 */
export const executeBatch = async (calls: BatchCall[], showLoading: boolean = true) => {
    const dappStore = useDappStore()
    
    try {
        if (showLoading) dappStore.dappLoading = true

        const { address, ethereum } = await getClients()

        // 编码所有调用
        const encodedCalls = calls.map(call => ({
            to: call.to,
            data: encodeFunctionData({
                abi: call.abi,
                functionName: call.functionName,
                args: call.args,
            }),
            value: '0x0',
        }))

        // 发送批量操作
        const batchResult = await ethereum.request({
            method: 'wallet_sendCalls',
            params: [{
                version: '2.0.0',
                chainId: `0x${currentChain.id.toString(16)}`,
                from: address,
                atomicRequired: true,
                calls: encodedCalls,
            }],
        })

        // 等待批量操作结果
        const batchId = typeof batchResult === 'string' ? batchResult : batchResult?.id
        let status: any = null
        let attempts = 0
        const maxAttempts = 30

        while (attempts < maxAttempts) {
            try {
                status = await ethereum.request({
                    method: 'wallet_getCallsStatus',
                    params: [batchId],
                })
                if (status.status === 200 || status.status === 'CONFIRMED') break
                if (status.status === 'FAILED' || status.status >= 400) throw new Error('交易失败')
            } catch (e: any) {
                if (e.message === '交易失败') throw e
            }

            await new Promise(resolve => setTimeout(resolve, 2000))
            attempts++
        }

        const isSuccess = status?.status === 200 || status?.status === 'CONFIRMED'

        if (isSuccess) message(t('操作成功'))
        else message(t('操作失败'), 'fail')

        return { batchId: batchId || batchResult, status }

    } catch (error: any) {
        console.log(error)
        message(t('操作失败'), 'fail')
        throw error
    } finally {
        if (showLoading) dappStore.dappLoading = false
    }
}

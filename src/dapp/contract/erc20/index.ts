import type { Abi } from 'viem'
import { useContract } from "../useContract";
import abi from './abi.json'
import { approveAmount, getAddress } from '@/dapp/config';
import { t } from '@/locale';
import { message } from '@/utils/message';

export function useErc20 () {
    const contract = useContract(import.meta.env.VITE_USDT, abi as Abi)
    
    // 读余额
    const readBalanceOf = async () => await contract.read('balanceOf', [getAddress()]) as bigint

    // 读授权额度
    const readAllowance = async (spender: string) => await contract.read('allowance', [getAddress(), spender]) as bigint

    // 检查余额 
    const checkBalance = async (amount: bigint) => {
        const balance = await readBalanceOf()
        if (balance < amount) {
            message(t('余额不足'))
            throw new Error('余额不足')
        }
    }

    // 检查授权余额
    const checkAllowance = async (spender: string, amount: bigint) => {
        const allowance = await readAllowance(spender)
        // 授权额度小于输入的额度，去授权
        if (allowance < amount){
            
            // 授权最大额度
            await contract.write('approve', [spender, approveAmount])

            // 授权输入的额度
            // await contract.write('approve', [spender, amount])
        }
    }

    // 转账
    const writeTransfer = async (to: string, amount: bigint) => {
        checkBalance(amount)
        return await contract.write('transfer', [to, amount])
    }

    // 授权
    const writeApprove = async (spender: string, amount: bigint) => {
        await checkBalance(amount)
        await checkAllowance(spender, amount)
    }

    return { readBalanceOf, readAllowance, checkBalance, checkAllowance, writeTransfer, writeApprove }
}
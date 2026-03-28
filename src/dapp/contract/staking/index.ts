import { type Abi } from "viem";
import { useContract } from "../useContract";
import abi from './abi.json'
import { getAddress } from "@/dapp/config";

export function useStaking() {
    const contract = useContract(import.meta.env.VITE_STAKING, abi as Abi)
    
    // 读资产
    const readBalanceOf = async () => await contract.read('balanceOf', [getAddress()])

    // 读团队业绩
    const readTeamKpi = async () => await contract.read('getTeamKpi', [getAddress()])

    // 读列表项对应业绩
    const readRewardOfSlot = async (index: number) => await contract.read('rewardOfSlot', [getAddress(), index])

    // 读取单条质押记录 (mapping 需要传地址和索引)
    const readUserStakeRecord = async (index: number) => await contract.read('userStakeRecord', [getAddress(), index])

    // 读最大质押金额
    const readMaxStakeAmount = async () => await contract.read('maxStakeAmount')

    // 读最小质押金额
    const readMinStakeAmount = async () => await contract.read('MIN_STAKE_AMOUNT')

    // 赎回
    const writeUnstake = async (index: number) => await contract.writeWithGas('unstake', [index])

    // 质押
    const writeStake = async (...args: any[]) => await contract.writeWithGas('stake', args)

    // 绑定上级并质押
    const writeStakeWithInviter = async (...args: any[]) => await contract.writeWithGas('stakeWithInviter', args)

    // 复投
    const writeRestake = async (...args: any[]) => await contract.writeWithGas('restake', args)

    // 领取
    const writeClaim = async (...args: any[]) => await contract.writeWithGas('claim', args)

    // 销毁
    const writeBurn = async (...args: any[]) => await contract.writeWithGas('burnExpiredReward', args)

    return { readBalanceOf, readTeamKpi, readRewardOfSlot, readUserStakeRecord, readMaxStakeAmount, writeUnstake, writeStake, writeStakeWithInviter, writeRestake, writeClaim, writeBurn, readMinStakeAmount }
}
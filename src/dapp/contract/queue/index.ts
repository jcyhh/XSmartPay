import { type Abi } from "viem";
import { useContract } from "../useContract";
import abi from './abi.json'

/**
 * Staking 合约接口
 * 根据前端接口文档 - 2. Staking 合约
 */
export function useQueue(contractAddress:any = import.meta.env.VITE_QUEUE) {

    const contract = useContract(contractAddress, abi as Abi)

    // 期号
    const readLaunchTime = async () => await contract.read('launchTime')

    // 是否中奖
    // const readQueueFomoReward = async (...args: any[]) => await contract.read('queueFomoReward', args)

    // 池金额
    // const readFomoPool = async () => await contract.read('fomoPool')

    // 中奖地址
    // const readGetFomoWinners = async () => await contract.read('getFomoWinners')

    // 最低质押数量
    const readMinStakeAmount = async () => await contract.read('MIN_STAKE_AMOUNT')

    // 最大质押数量
    const readMaxStakeAmount = async () => await contract.read('maxStakeAmountValue')

    // 查询复投额外金额
    // const readFomoEnabled = async () => await contract.read('fomoEnabled')
    const readFomoEnabled = async () => false

    // 查询复投满额额度
    const readRemainingStakeAmount = async () => await contract.read('remainingStakeAmount')

    // 质押
    const writeStake = async (...args: any[]) => await contract.writeWithGas('stake', args)

    // 绑定上级
    const writeBindReferral = async (...args: any[]) => await contract.writeWithGas('bindReferral', args)

    // 绑定上级并质押
    const writeStakeWithInviter = async (...args: any[]) => await contract.writeWithGas('stakeWithInviter', args)

    // 取消排队
    const writeCancelQueue = async (...args: any[]) => await contract.write('cancelQueue', args)

    // 赎回
    const writeUnStake = async (...args: any[]) => await contract.writeWithGas('unstake', args)

    // 复投
    const writeRestake = async (...args: any[]) => await contract.writeWithGas('restake', args)

    // 领取奖励
    const writeClaim = async (...args: any[]) => await contract.writeWithGas('claim', args)

    return {
        readLaunchTime,
        readMinStakeAmount,
        readMaxStakeAmount,
        readFomoEnabled,
        readRemainingStakeAmount,

        writeStake,
        writeBindReferral,
        writeStakeWithInviter,
        writeCancelQueue,
        writeUnStake,
        writeRestake,
        writeClaim
    }
}
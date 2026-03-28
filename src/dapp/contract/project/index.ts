import { type Abi } from "viem";
import { useContract } from "../useContract";
import abi from './abi.json'

/**
 * Staking 合约接口
 * 根据前端接口文档 - 2. Staking 合约
 */
export function useProject() {

    const contract = useContract(import.meta.env.VITE_PROJECT, abi as Abi)

    // 领取代币
    const writeClaim = async (...args: any[]) => await contract.writeWithGas('claim', args)

    // 领取额度
    const writeClaimQuota= async (...args: any[]) => await contract.writeWithGas('claimQuota', args)

    return {
        writeClaim,
        writeClaimQuota
    }
}
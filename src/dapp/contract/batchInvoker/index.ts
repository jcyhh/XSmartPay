import { type Address, type Abi } from 'viem'
import { executeBatch } from './useBatchInvoker'
import stakingAbi from '../staking/abi.json'

// ============= 合约配置 =============

const STAKING_ADDRESS = import.meta.env.VITE_STAKING as Address
const STAKING_ABI = stakingAbi as Abi

// ============= 预设组合 =============

/** 赎回 + 销毁 */
export const unstakeAndBurn = (args1: any[], args2: any[]) => executeBatch([
    { to: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'unstake', args: args1 },
    { to: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'burnExpiredReward', args: args2 },
])

/** 复投 + 销毁 */
export const restakeAndBurn = (args1: any[], args2: any[]) => executeBatch([
    { to: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'restake', args: args1 },
    { to: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'burnExpiredReward', args: args2 },
])

/** 领取 + 销毁 */
export const claimAndBurn = (args1: any[], args2: any[]) => executeBatch([
    { to: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'claim', args: args1 },
    { to: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'burnExpiredReward', args: args2 },
])

export const setTeamVirtuallyInvestValue = (args1: any[]) => executeBatch([
    { to: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'setTeamVirtuallyInvestValue', args: args1 }
])

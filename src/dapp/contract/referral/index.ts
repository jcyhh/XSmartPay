import { type Abi } from "viem";
import { useContract } from "../useContract";
import abi from './abi.json'
import { getAddress } from "@/dapp/config";

export function useReferral () {
    const contract = useContract(import.meta.env.VITE_REFERRAL, abi as Abi)

    // 读根用户地址
    const readRootAddress = async () => await contract.read('getRootAddress');

    // 读是否绑定了推荐人
    const readIsBindReferrer = async () => await contract.read('isBindReferral', [getAddress()])

    return { readRootAddress, readIsBindReferrer }
}
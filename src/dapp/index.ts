import {
    createWalletClient,
    custom,
    publicActions,
    type Address,
    defineChain
} from 'viem'
import { bsc } from 'viem/chains'
import detectEthereumProvider from '@metamask/detect-provider'
import { minGasBalance, type SignMessage } from './config'
import { t } from '@/locale'
import { message } from '@/utils/message'

// 自定义测试网络配置
const localTestnet = defineChain({
    id: 31337,
    name: 'Local Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'GO',
        symbol: 'GO',
    },
    rpcUrls: {
        default: {
            http: [import.meta.env.VITE_RPC_URL],
        },
    },
})

// 正式环境BSC(币安链)、开发环境本地测试网络
export const currentChain = import.meta.env.PROD ? bsc : localTestnet

// viem写合约的实例
let _walletClient: any = null
// 钱包实例
let _ethereum: any = null

// 检测并获取钱包
export const detectProvider = async () => {
    if (_ethereum) return _ethereum
    const provider = await detectEthereumProvider({
        mustBeMetaMask: false,
        silent: true,
        timeout: 6000
    })
    _ethereum = provider
    return _ethereum
}

/**
 * 获取钱包 provider
 */
export const getEthereum = () => {
    const ethereum = _ethereum ? _ethereum : (window as any).ethereum
    if(ethereum)return ethereum
    throw new Error('没有钱包环境')
}

/**
 * viem读合约的实例
 */
export const getPublicClient = () => {
    return getWalletClient()
}

/**
 * viem写合约的实例
 */
export const getWalletClient = () => {
    if (!_walletClient) {
        const ethereum = getEthereum()
        _walletClient = createWalletClient({
            chain: currentChain,
            transport: custom(ethereum)
        }).extend(publicActions)
    }
    return _walletClient!
}

/**
 * 链接钱包
 */
export const getConnectedAddress = async (): Promise<Address> => {
    const walletClient = getWalletClient()
    const [address] = await walletClient.getAddresses()
    if (!address) {
        await walletClient.requestAddresses()
        const [newAddress] = await walletClient.getAddresses()
        return newAddress
    }
    return address
}

/**
 * 检查并切换网络
 * 如果当前网络不是 currentChain，则切换；如果钱包没有该网络则先添加
 */
export const checkChain = async () => {
    // 开发环境不判断网络
    if(!import.meta.env.PROD)return true;
    const ethereum = getEthereum()
    
    // 获取当前网络 chainId
    const currentChainId = await ethereum.request({ method: 'eth_chainId' })
    const targetChainId = `0x${currentChain.id.toString(16)}`
    console.log(`当前网络${currentChainId}-${Number(currentChainId)}`, `需要切换到的网络${targetChainId}-${Number(targetChainId)}`);
    
    
    // 已经是目标网络
    if (currentChainId === targetChainId) {
        return true
    }
    
    try {
        // 尝试切换网络
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }]
        })
        return true
    } catch (error: any) {
        // 4902: 网络不存在，需要添加
        if (error.code === 4902) {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: targetChainId,
                        chainName: currentChain.name,
                        nativeCurrency: currentChain.nativeCurrency,
                        rpcUrls: [currentChain.rpcUrls.default.http[0]],
                        blockExplorerUrls: currentChain.blockExplorers 
                            ? [currentChain.blockExplorers.default.url] 
                            : undefined
                    }]
                })
                return true
            } catch (addError) {
                console.error('添加网络失败:', addError)
                throw addError
            }
        }
        throw error
    }
}

/**
 * 检查 ETH 余额是否至少 0.0004
 * 不足时抛出异常
 */
export const checkGasBalance = async () => {
    const walletClient = getWalletClient()
    const address = await getConnectedAddress()
    const balance = await walletClient.getBalance({ address })
    
    if (balance < minGasBalance) {
        message(t('Gas费用不足'))
        throw new Error('Gas费用不足')
    }
}

/**
 * 获取签名
 */
export const getSign = async (message: SignMessage) => {
    const walletClient = getWalletClient()
    const [address] = await walletClient.getAddresses()
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = await walletClient.signMessage({
        account: address,
        message: `${message}-${timestamp}`
    })
    return { signature, timestamp }
}

/**
 * 获取所有客户端（智能合约批量）
 */
export const getClients = async () => {
        await detectProvider()
        const publicClient = getPublicClient()
        const walletClient = getWalletClient()
        const address = await getConnectedAddress()
        const ethereum = getEthereum()
        return { publicClient, walletClient, address, ethereum }
}

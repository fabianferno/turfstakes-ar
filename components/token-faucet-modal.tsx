'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, RefreshCw, Check, X } from 'lucide-react';
import { CLUB_TOKENS } from '@/lib/contracts';
import { FAN_TOKEN_ABI } from '@/lib/abi';
import { formatUnits, parseUnits } from 'viem';
import { useToast } from '@/hooks/use-toast';

interface TokenBalance {
    address: string;
    balance: string;
    symbol: string;
    name: string;
    image: string;
}

export default function TokenFaucetModal() {
    const { address, isConnected } = useAccount();
    const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
    const [selectedToken, setSelectedToken] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const { toast } = useToast();

    const { writeContract, data: hash } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        });

    // Function to fetch balance for a single token
    const useTokenBalance = (tokenAddress: string) => {
        return useReadContract({
            address: tokenAddress as `0x${string}`,
            abi: FAN_TOKEN_ABI,
            functionName: 'balanceOf',
            args: [address as `0x${string}`],
            // enabled: !!address && isConnected,
        });
    };

    // Get all token balances
    const tokenBalanceQueries = CLUB_TOKENS.map(token => ({
        token,
        balance: useTokenBalance(token.tokenAddress),
    }));

    // Update token balances when data changes
    useEffect(() => {
        if (isConnected && address) {
            const balances: TokenBalance[] = tokenBalanceQueries.map(({ token, balance }) => ({
                address: token.tokenAddress,
                balance: balance.data ? formatUnits(balance.data as bigint, 18) : '0',
                symbol: token.tokenSymbol,
                name: token.name,
                image: token.tokenImage,
            }));
            setTokenBalances(balances);
        }
    }, [isConnected, address, ...tokenBalanceQueries.map(q => q.balance.data)]);

    // Handle minting tokens
    const handleMint = async (tokenAddress: string) => {
        if (!address || !isConnected) return;

        setIsMinting(true);
        setSelectedToken(tokenAddress);

        try {
            await writeContract({
                address: tokenAddress as `0x${string}`,
                abi: FAN_TOKEN_ABI,
                functionName: 'mint',
                args: [address as `0x${string}`, parseUnits('100', 18)],
            });
        } catch (error) {
            console.error('Error minting tokens:', error);
            setIsMinting(false);
        }
    };

    // Reset states when transaction is confirmed
    useEffect(() => {
        if (isConfirmed) {
            const selectedTokenData = CLUB_TOKENS.find(token => token.tokenAddress === selectedToken);

            toast({
                title: "Tokens Minted Successfully! 🎉",
                description: `100 ${selectedTokenData?.tokenSymbol || 'tokens'} have been added to your wallet.`,
            });

            setIsMinting(false);
            setSelectedToken('');
            // Refresh balances by triggering a re-fetch
            // This is a simple way to refresh - in production you might want to use a more sophisticated approach
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }, [isConfirmed, selectedToken, toast]);

    if (!isConnected) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="bg-[#00D4FF] text-black font-black border-4 border-white hover:bg-white hover:text-black transform hover:scale-105 transition-all duration-200 shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-[6px_6px_0px_0px_#ffffff]"
                    >
                        <Coins className="mr-2 h-4 w-4" />
                        FAUCET
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-black border-4 border-[#00D4FF] text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-[#00D4FF] font-black text-2xl">
                            CONNECT WALLET FIRST
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-center text-white">
                        Please connect your wallet to access the fan token faucet.
                    </p>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="bg-[#00D4FF] text-black font-black border-4 border-white hover:bg-white hover:text-black transform hover:scale-105 transition-all duration-200 shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-[6px_6px_0px_0px_#ffffff]"
                >
                    <Coins className="mr-2 h-4 w-4" />
                    FAUCET
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-4 border-[#00D4FF] text-white max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[#00D4FF] font-black text-2xl">
                        FAN TOKEN FAUCET
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {tokenBalances.map((token, index) => (
                        <Card
                            key={token.address}
                            className="bg-black border-4 border-white hover:border-[#00D4FF] transition-colors"
                        >
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <img
                                        src={token.image}
                                        alt={token.name}
                                        className="bg-white w-12 h-12 border-2 border-[#00D4FF]"
                                    />
                                    <div>
                                        <div className="font-black text-lg">{token.symbol}</div>
                                        <div className="text-sm text-gray-400">{token.name}</div>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="mb-4">
                                    <div className="text-sm text-gray-400 mb-1">Your Balance:</div>
                                    <Badge className="bg-[#00D4FF] text-black font-black text-lg px-3 py-1">
                                        {parseFloat(token.balance).toFixed(2)} ${token.symbol}
                                    </Badge>
                                </div>

                                <Button
                                    onClick={() => handleMint(token.address)}
                                    disabled={isMinting && selectedToken === token.address}
                                    className="w-full bg-[#00D4FF] text-black font-black border-4 border-white hover:bg-white hover:text-black transform hover:scale-105 transition-all duration-200 shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-[6px_6px_0px_0px_#ffffff] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isMinting && selectedToken === token.address ? (
                                        <>
                                            {isConfirming ? (
                                                <>
                                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                    CONFIRMING...
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                    MINTING...
                                                </>
                                            )}
                                        </>
                                    ) : isConfirmed && selectedToken === token.address ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            MINTED!
                                        </>
                                    ) : (
                                        <>
                                            <Coins className="mr-2 h-4 w-4" />
                                            MINT 100 {token.symbol}
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-gray-900 border-2 border-[#00D4FF] rounded-lg">
                    <h3 className="text-[#00D4FF] font-black text-lg mb-2">HOW IT WORKS:</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Each mint gives you 100 fan tokens</li>
                        <li>• Tokens are minted directly to your wallet</li>
                        <li>• Use these tokens to stake on monuments</li>
                        <li>• More tokens = more voting power</li>
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
} 
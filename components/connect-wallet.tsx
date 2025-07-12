'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';

export default function ConnectWallet() {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
            }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <Button
                                        onClick={openConnectModal}
                                        className="bg-[#00D4FF] text-black font-black border-4 border-white hover:bg-white hover:text-black transform hover:scale-105 transition-all duration-200 shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-[6px_6px_0px_0px_#ffffff]"
                                    >
                                        CONNECT WALLET
                                    </Button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <Button
                                        onClick={openChainModal}
                                        className="bg-red-500 text-white font-black border-4 border-white hover:bg-red-600 transform hover:scale-105 transition-all duration-200 shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-[6px_6px_0px_0px_#ffffff]"
                                    >
                                        WRONG NETWORK
                                    </Button>
                                );
                            }

                            return (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={openChainModal}
                                        className="bg-[#00D4FF] text-black font-black border-4 border-white hover:bg-white hover:text-black transform hover:scale-105 transition-all duration-200 shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-[6px_6px_0px_0px_#ffffff]"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background: chain.iconBackground,
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
                                                    marginRight: 4,
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                        style={{ width: 12, height: 12 }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {chain.name}
                                    </Button>

                                    <Button
                                        onClick={openAccountModal}
                                        className="bg-[#00D4FF] text-black font-black border-4 border-white hover:bg-white hover:text-black transform hover:scale-105 transition-all duration-200 shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-[6px_6px_0px_0px_#ffffff]"
                                    >
                                        {account.displayName}
                                        {account.displayBalance
                                            ? ` (${account.displayBalance})`
                                            : ''}
                                    </Button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
} 
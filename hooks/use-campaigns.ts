import { useReadContract } from "wagmi";
import { TURF_STAKE_ABI } from "@/lib/abi";
import { TURF_STAKE_CONTRACT } from "@/lib/contracts";

export interface Campaign {
  id: bigint;
  monumentId: bigint;
  sponsor: string;
  adContent: string;
  budget: bigint;
  active: boolean;
}

export const useCampaign = (campaignId: bigint | undefined) => {
  const {
    data: campaign,
    isLoading,
    error,
  } = useReadContract({
    address: TURF_STAKE_CONTRACT as `0x${string}`,
    abi: TURF_STAKE_ABI,
    functionName: "getCampaign",
    args: campaignId ? [campaignId] : undefined,
    query: {
      enabled: !!campaignId,
    },
  });

  return {
    campaign: campaign as Campaign | undefined,
    isLoading,
    error,
  };
};

// For now, we'll create a simple hook that returns active campaigns
// In a real implementation, you'd have a way to get all active campaigns from the contract
export const useActiveCampaigns = () => {
  // Since the contract doesn't have a direct way to get all campaigns,
  // we'll return an empty array for now
  // In a real implementation, you'd need to:
  // 1. Add events indexing to track campaigns
  // 2. Add a view function to get all campaigns
  // 3. Or use a subgraph/indexer

  return {
    data: [] as bigint[],
    isLoading: false,
    error: null,
  };
};

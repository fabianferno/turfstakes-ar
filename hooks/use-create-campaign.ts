import { useState, useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { TURF_STAKE_ABI } from "@/lib/abi";
import { TURF_STAKE_CONTRACT } from "@/lib/contracts";

export interface CampaignData {
  monumentId: string;
  title: string;
  description: string;
  imageUrl: string;
  budget: string;
  duration: string;
}

export const useCreateCampaign = () => {
  const [isUploading, setIsUploading] = useState(false);

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const uploadToIpfs = useCallback(async (file: File): Promise<string> => {
    if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
      throw new Error("Pinata JWT not configured");
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to upload to IPFS: ${response.statusText}`);
      }

      const data = await response.json();
      const gatewayUrl =
        process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL ||
        "https://gateway.pinata.cloud";
      return `${gatewayUrl}/ipfs/${data.IpfsHash}`;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const createCampaign = useCallback(
    async (campaignData: CampaignData) => {
      try {
        // Create the ad content object
        const adContent = {
          title: campaignData.title,
          description: campaignData.description,
          imageUrl: campaignData.imageUrl,
          duration: campaignData.duration,
        };

        // Convert ad content to JSON string (in production, this would be uploaded to IPFS)
        const adContentString = JSON.stringify(adContent);

        // Convert budget to wei (assuming 18 decimals)
        const budgetWei = parseUnits(campaignData.budget, 18);

        // Call the contract
        writeContract({
          address: TURF_STAKE_CONTRACT as `0x${string}`,
          abi: TURF_STAKE_ABI,
          functionName: "createCampaign",
          args: [BigInt(campaignData.monumentId), adContentString, budgetWei],
        });
      } catch (error) {
        console.error("Error creating campaign:", error);
        throw error;
      }
    },
    [writeContract]
  );

  return {
    createCampaign,
    uploadToIpfs,
    isPending,
    isConfirming,
    isSuccess,
    isUploading,
    error,
    hash,
  };
};

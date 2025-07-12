import { useReadContract } from "wagmi";
import { TURF_STAKE_ABI } from "@/lib/abi";
import { TURF_STAKE_CONTRACT } from "@/lib/contracts";

export interface Monument {
  id: bigint;
  creator: string;
  clubName: string;
  latitude: number;
  longitude: number;
  anchorImageHash: string;
  totalStaked: bigint;
  level: bigint;
  active: boolean;
}

export const useMonuments = () => {
  const { data: totalMonuments } = useReadContract({
    address: TURF_STAKE_CONTRACT as `0x${string}`,
    abi: TURF_STAKE_ABI,
    functionName: "getTotalMonuments",
  });

  const { data: allMonumentIds } = useReadContract({
    address: TURF_STAKE_CONTRACT as `0x${string}`,
    abi: TURF_STAKE_ABI,
    functionName: "getAllMonuments",
  });

  return {
    totalMonuments: totalMonuments as bigint | undefined,
    allMonumentIds: allMonumentIds as bigint[] | undefined,
  };
};

export const useMonument = (monumentId: string | undefined) => {
  const {
    data: monument,
    isLoading,
    error,
  } = useReadContract({
    address: TURF_STAKE_CONTRACT as `0x${string}`,
    abi: TURF_STAKE_ABI,
    functionName: "getMonument",
    args: monumentId ? [BigInt(monumentId)] : undefined,
    query: {
      enabled: !!monumentId,
    },
  });

  return {
    monument: monument as Monument | undefined,
    isLoading,
    error,
  };
};

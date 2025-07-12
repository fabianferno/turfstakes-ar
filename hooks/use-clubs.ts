import { useReadContract } from "wagmi";
import { TURF_STAKE_ABI } from "@/lib/abi";
import { TURF_STAKE_CONTRACT, CLUB_TOKENS } from "@/lib/contracts";

export interface Club {
  name: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenImage: string;
  color: string;
}

export const useClubs = () => {
  const {
    data: registeredClubs,
    isLoading,
    error,
  } = useReadContract({
    address: TURF_STAKE_CONTRACT as `0x${string}`,
    abi: TURF_STAKE_ABI,
    functionName: "getRegisteredClubs",
  });

  // Color mapping for clubs based on token symbol
  const colorMap: { [key: string]: string } = {
    PSG: "#003889",
    BAR: "#A50044",
    CITY: "#6CABDD",
    JUV: "#000000",
    ACM: "#AC1E26",
  };

  // Fallback clubs if none are registered
  const fallbackClubs: Club[] = CLUB_TOKENS.map((token) => ({
    name: token.name,
    tokenAddress: token.tokenAddress,
    tokenSymbol: token.tokenSymbol,
    tokenImage: token.tokenImage,
    color: colorMap[token.tokenSymbol] || "#000000",
  }));

  // Map registered clubs to our club data with metadata
  const registeredClubsData: Club[] = ((registeredClubs as string[]) || []).map(
    (clubName) => {
      const clubData = CLUB_TOKENS.find(
        (token) => token.name === clubName || token.tokenSymbol === clubName
      );

      return {
        name: clubName,
        tokenAddress: clubData?.tokenAddress || "",
        tokenSymbol: clubData?.tokenSymbol || "",
        tokenImage: clubData?.tokenImage || "",
        color: colorMap[clubData?.tokenSymbol || ""] || "#000000",
      };
    }
  );

  // Use registered clubs if available, otherwise use fallback
  const clubs =
    registeredClubsData.length > 0 ? registeredClubsData : fallbackClubs;

  return {
    clubs,
    isLoading,
    error,
    hasRegisteredClubs: registeredClubsData.length > 0,
  };
};

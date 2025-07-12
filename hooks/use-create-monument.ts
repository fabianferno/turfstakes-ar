import { useState, useCallback } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { TURF_STAKE_ABI } from "@/lib/abi";
import { TURF_STAKE_CONTRACT } from "@/lib/contracts";
import { useToast } from "@/hooks/use-toast";

export const useCreateMonument = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const { toast } = useToast();

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const convertCoordinates = useCallback((lat: number, lng: number) => {
    // Convert to int32 format required by contract (multiply by 1,000,000)
    const latInt32 = Math.round(lat * 1000000);
    const lngInt32 = Math.round(lng * 1000000);
    return { latInt32, lngInt32 };
  }, []);

  // Check if coordinates are already used
  const coordinatesArgs = coordinates
    ? [
        convertCoordinates(coordinates.lat, coordinates.lng).latInt32,
        convertCoordinates(coordinates.lat, coordinates.lng).lngInt32,
      ]
    : [0, 0];

  const { data: coordinatesUsed, isLoading: checkingCoordinates } =
    useReadContract({
      address: TURF_STAKE_CONTRACT as `0x${string}`,
      abi: TURF_STAKE_ABI,
      functionName: "areCoordinatesUsed",
      args: coordinatesArgs,
    });

  const checkCoordinates = useCallback((lat: number, lng: number) => {
    setCoordinates({ lat, lng });
  }, []);

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

  const uploadImageDataToIpfs = useCallback(
    async (imageData: string): Promise<string> => {
      if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
        throw new Error("Pinata JWT not configured");
      }

      setIsUploading(true);
      try {
        // Convert base64 to blob
        const response = await fetch(imageData);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append("file", blob, `monument-anchor-${Date.now()}.jpg`);

        const uploadResponse = await fetch(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            },
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error(
            `Failed to upload to IPFS: ${uploadResponse.statusText}`
          );
        }

        const data = await uploadResponse.json();
        const gatewayUrl =
          process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL ||
          "https://gateway.pinata.cloud";
        return `${gatewayUrl}/ipfs/${data.IpfsHash}`;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const createMonument = useCallback(
    async (params: {
      clubName: string;
      latitude: number;
      longitude: number;
      anchorImageData: string;
    }) => {
      try {
        // Check if coordinates are already used
        const { latInt32, lngInt32 } = convertCoordinates(
          params.latitude,
          params.longitude
        );

        // Set coordinates to trigger the check
        setCoordinates({ lat: params.latitude, lng: params.longitude });

        // Wait a moment for the contract call to complete
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (coordinatesUsed && coordinates) {
          toast({
            title: "Location Already Used",
            description:
              "A monument already exists at this location. Please choose a different location.",
            variant: "destructive",
          });
          return;
        }

        // Upload anchor image to IPFS
        const anchorImageHash = await uploadImageDataToIpfs(
          params.anchorImageData
        );

        // Create monument on contract
        await writeContract({
          address: TURF_STAKE_CONTRACT as `0x${string}`,
          abi: TURF_STAKE_ABI,
          functionName: "createMonument",
          args: [params.clubName, latInt32, lngInt32, anchorImageHash],
        });

        toast({
          title: "Monument Creation Initiated",
          description: "Please wait for the transaction to be confirmed.",
        });
      } catch (error) {
        console.error("Error creating monument:", error);
        toast({
          title: "Error",
          description: "Failed to create monument. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [
      writeContract,
      uploadImageDataToIpfs,
      convertCoordinates,
      coordinatesUsed,
      coordinates,
      toast,
    ]
  );

  return {
    createMonument,
    checkCoordinates,
    isUploading,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    coordinatesUsed: coordinates ? coordinatesUsed : false,
    checkingCoordinates,
  };
};

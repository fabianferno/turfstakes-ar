"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, Upload, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface ImageUploadProps {
    onImageUpload: (file: File) => Promise<string>
    onImageUrlChange: (url: string) => void
    imageUrl: string
    isUploading: boolean
    label: string
    placeholder?: string
}

export function ImageUpload({
    onImageUpload,
    onImageUrlChange,
    imageUrl,
    isUploading,
    label,
    placeholder = "https://your-image.com/banner.jpg"
}: ImageUploadProps) {
    const [isCameraOpen, setIsCameraOpen] = useState(false)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [isMounted, setIsMounted] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const startCamera = useCallback(async () => {
        if (typeof window === 'undefined' || !navigator.mediaDevices) return

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }, // Use back camera on mobile
                audio: false,
            })
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
        } catch (error) {
            console.error('Error accessing camera:', error)
            alert('Could not access camera. Please make sure you have given permission and try again.')
        }
    }, [])

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
    }, [stream])

    const capturePhoto = useCallback(async () => {
        if (typeof window === 'undefined' || !videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        if (!context) return

        // Set canvas size to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame to canvas
        context.drawImage(video, 0, 0)

        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
            if (blob) {
                const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
                try {
                    const url = await onImageUpload(file)
                    onImageUrlChange(url)
                    setIsCameraOpen(false)
                    stopCamera()
                } catch (error) {
                    console.error('Error uploading image:', error)
                    alert('Failed to upload image. Please try again.')
                }
            }
        }, 'image/jpeg', 0.8)
    }, [onImageUpload, onImageUrlChange, stopCamera])

    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            try {
                const url = await onImageUpload(file)
                onImageUrlChange(url)
            } catch (error) {
                console.error('Error uploading image:', error)
                alert('Failed to upload image. Please try again.')
            }
        }
    }, [onImageUpload, onImageUrlChange])

    const handleCameraOpen = useCallback(() => {
        setIsCameraOpen(true)
        startCamera()
    }, [startCamera])

    const handleCameraClose = useCallback(() => {
        setIsCameraOpen(false)
        stopCamera()
    }, [stopCamera])

    // Don't render camera functionality on server
    if (!isMounted) {
        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-lg font-bold">
                        {label}
                    </Label>
                    <Input
                        id="imageUrl"
                        type="url"
                        value={imageUrl}
                        onChange={(e) => onImageUrlChange(e.target.value)}
                        placeholder={placeholder}
                        className="border-4 border-black h-14 text-lg font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600"
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-lg font-bold">
                    {label}
                </Label>
                <div className="flex gap-2">
                    <Input
                        id="imageUrl"
                        type="url"
                        value={imageUrl}
                        onChange={(e) => onImageUrlChange(e.target.value)}
                        placeholder={placeholder}
                        className="border-4 border-black h-14 text-lg font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 flex-1"
                    />
                    <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="border-4 border-black h-14 px-4 shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
                    >
                        <Upload className="h-5 w-5" />
                    </Button>
                    {navigator.mediaDevices && (
                        <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    type="button"
                                    onClick={handleCameraOpen}
                                    disabled={isUploading}
                                    className="border-4 border-black h-14 px-4 shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
                                >
                                    <Camera className="h-5 w-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Take Photo</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            className="w-full h-64 object-cover rounded-lg bg-black"
                                        />
                                        <canvas
                                            ref={canvasRef}
                                            className="hidden"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={capturePhoto}
                                            disabled={!stream || isUploading}
                                            className="flex-1"
                                        >
                                            {isUploading ? 'Uploading...' : 'Capture'}
                                        </Button>
                                        <Button
                                            onClick={handleCameraClose}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
            />

            {imageUrl && (
                <div className="relative">
                    <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-32 object-cover border-4 border-black rounded"
                        onError={(e) => {
                            console.error('Image load error:', e)
                        }}
                    />
                    <Button
                        type="button"
                        onClick={() => onImageUrlChange('')}
                        className="absolute top-2 right-2 h-8 w-8 p-0 bg-red-500 text-white border-2 border-black"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {isUploading && (
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    <p className="mt-2 text-sm font-mono">Uploading to IPFS...</p>
                </div>
            )}
        </div>
    )
} 
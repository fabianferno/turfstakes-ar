"use client"

import { useState, useEffect } from "react"
import { Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { useCreateCampaign } from "@/hooks/use-create-campaign"
import { useMonuments } from "@/hooks/use-monuments"
import { toast } from "sonner"

export default function CreateCampaignPage() {
  const [formData, setFormData] = useState({
    monumentId: "",
    title: "",
    description: "",
    imageUrl: "",
    budget: "",
    duration: "7", // days
  })

  const [preview, setPreview] = useState(false)

  const {
    createCampaign,
    uploadToIpfs,
    isPending,
    isConfirming,
    isSuccess,
    isUploading,
    error,
  } = useCreateCampaign()

  const { allMonumentIds } = useMonuments()

  useEffect(() => {
    if (isSuccess) {
      toast.success("Campaign created successfully!")
      // Reset form
      setFormData({
        monumentId: "",
        title: "",
        description: "",
        imageUrl: "",
        budget: "",
        duration: "7",
      })
      setPreview(false)
    }
  }, [isSuccess])

  useEffect(() => {
    if (error) {
      toast.error(`Error creating campaign: ${error.message}`)
    }
  }, [error])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.monumentId || !formData.title || !formData.description || !formData.budget || !formData.duration) {
      toast.error("Please fill in all required fields")
      return
    }

    // Basic validation
    const budgetNum = parseFloat(formData.budget)
    if (isNaN(budgetNum) || budgetNum <= 0) {
      toast.error("Please enter a valid budget amount")
      return
    }

    const durationNum = parseInt(formData.duration)
    if (isNaN(durationNum) || durationNum <= 0) {
      toast.error("Please enter a valid duration")
      return
    }

    createCampaign(formData)
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    return await uploadToIpfs(file)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b-8 border-black bg-white">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-2xl font-black">
              <ArrowLeft className="h-6 w-6" />
              BACK TO MAP
            </Link>
          </div>
        </div>
      </nav>

      <main className="container py-12">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tighter uppercase">CREATE NEW CAMPAIGN</h1>
              <p className="text-xl font-mono">Deploy your advertising campaign on the blockchain</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Form */}
              <div className="bg-white border-8 border-black p-8 shadow-brutal">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    {/* Monument Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="monument" className="text-lg font-bold">
                        SELECT MONUMENT *
                      </Label>
                      <Select value={formData.monumentId} onValueChange={(value) => setFormData({ ...formData, monumentId: value })}>
                        <SelectTrigger className="border-4 border-black h-14 text-lg font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600">
                          <SelectValue placeholder="Choose a monument to advertise on" />
                        </SelectTrigger>
                        <SelectContent>
                          {allMonumentIds?.map((id) => (
                            <SelectItem key={id.toString()} value={id.toString()}>
                              Monument #{id.toString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Campaign Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-lg font-bold">
                        CAMPAIGN TITLE *
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter compelling campaign title"
                        className="border-4 border-black h-14 text-lg font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-lg font-bold">
                        DESCRIPTION *
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your product or service"
                        className="border-4 border-black text-lg font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 min-h-[120px]"
                        required
                      />
                    </div>

                    {/* Image Upload */}
                    <ImageUpload
                      onImageUpload={handleImageUpload}
                      onImageUrlChange={(url) => setFormData({ ...formData, imageUrl: url })}
                      imageUrl={formData.imageUrl}
                      isUploading={isUploading}
                      label="CAMPAIGN IMAGE"
                      placeholder="https://your-image.com/banner.jpg"
                    />

                    {/* Budget & Duration */}
                    <div className="space-y-6">
                      <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2">BUDGET & DURATION</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="budget" className="text-lg font-bold">
                            BUDGET (CHZ) *
                          </Label>
                          <Input
                            id="budget"
                            type="number"
                            step="0.001"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            placeholder="0.01"
                            className="border-4 border-black h-14 text-lg font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600"
                            required
                          />
                          <p className="text-sm font-mono text-gray-600">
                            Minimum: 0.01 CHZ
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration" className="text-lg font-bold">
                            DURATION (DAYS) *
                          </Label>
                          <Input
                            id="duration"
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            placeholder="7"
                            className="border-4 border-black h-14 text-lg font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setPreview(!preview)}
                      className="bg-yellow-500 border-4 border-black px-6 py-3 font-bold text-lg shadow-brutal hover:translate-y-1 hover:shadow-none transition-all inline-flex items-center gap-2"
                    >
                      <Eye className="h-5 w-5" />
                      {preview ? "HIDE PREVIEW" : "PREVIEW CAMPAIGN"}
                    </button>
                    <button
                      type="submit"
                      disabled={isPending || isConfirming || isUploading}
                      className="bg-red-600 text-white border-4 border-black px-6 py-3 font-bold text-lg shadow-brutal hover:translate-y-1 hover:shadow-none transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? "CONFIRMING..." : isConfirming ? "DEPLOYING..." : isUploading ? "UPLOADING..." : "DEPLOY CAMPAIGN"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Preview */}
              <div className="space-y-8">
                <div className="bg-black text-white border-8 border-black p-8 shadow-brutal-inverse">
                  <h2 className="text-2xl font-black uppercase border-b-4 border-white pb-2 mb-6">CAMPAIGN SUMMARY</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-mono">Monument:</span>
                      <span className="font-bold">#{formData.monumentId || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono">Budget:</span>
                      <span className="font-bold">{formData.budget || "0"} CHZ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono">Duration:</span>
                      <span className="font-bold">{formData.duration || "0"} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono">Est. Impressions:</span>
                      <span className="font-bold">
                        {formData.budget ? Math.floor(parseFloat(formData.budget) * 1000) : "0"}
                      </span>
                    </div>
                  </div>
                </div>

                {preview && formData.title && (
                  <div className="bg-white border-8 border-black p-8 shadow-brutal">
                    <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 mb-6">CAMPAIGN PREVIEW</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-100 border-4 border-black p-6">
                        {formData.imageUrl && (
                          <div className="mb-4">
                            <img
                              src={formData.imageUrl}
                              alt="Campaign preview"
                              className="w-full h-32 object-cover border-2 border-black"
                              onError={(e) => {
                                e.currentTarget.style.display = "none"
                              }}
                            />
                          </div>
                        )}
                        <h4 className="text-lg font-bold mb-2">{formData.title}</h4>
                        <p className="font-mono text-sm mb-4">{formData.description}</p>
                        <div className="text-xs font-mono text-gray-600">
                          Campaign runs for {formData.duration} days
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

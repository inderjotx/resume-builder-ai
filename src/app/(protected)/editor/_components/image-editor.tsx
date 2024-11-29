"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface ImageEditorProps {
  onSave: (croppedImage: Blob) => Promise<void>;
}
const MAX_IMAGE_SIZE = 1024 * 1024 * 2; // 2MB

export function ImageEditor({ onSave }: ImageEditorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const size = file?.size;
    if (size && size > MAX_IMAGE_SIZE) {
      toast.error("Image size is too large");
      return;
    }
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createCroppedImage = async () => {
    try {
      const image = new Image();
      if (!selectedImage) {
        toast.error("No image selected");
        return;
      }
      image.src = selectedImage;
      await new Promise((resolve) => (image.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx || !croppedAreaPixels) return;

      canvas.width = 400;
      canvas.height = 400;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas to Blob conversion failed"));
            }
          },
          "image/jpeg",
          0.9,
        );
      });
    } catch (error) {
      console.error("Error creating cropped image:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col gap-4 py-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="mb-4 hidden"
        id="image-upload"
      />

      {selectedImage && (
        <>
          <div className="relative mt-4 h-60 overflow-hidden rounded-md">
            <Cropper
              image={selectedImage}
              crop={crop}
              cropShape="round"
              zoom={zoom}
              aspect={3 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Label>Zoom</Label>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => setZoom(value[0] ?? 1)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                className="w-full"
              >
                Change Image
              </Button>
              <Button
                disabled={isLoading}
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    const croppedBlob = await createCroppedImage();
                    if (croppedBlob) {
                      await onSave(croppedBlob);
                    }
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {isLoading ? "Saving Image..." : "Save Cropped Image"}
              </Button>
            </div>
          </div>
        </>
      )}

      {!selectedImage && (
        <div className="flex flex-col items-center gap-4 p-4">
          <Label
            htmlFor="image-upload"
            className="flex size-40 cursor-pointer items-center justify-center rounded-full border-2 border-dashed bg-muted hover:bg-muted/80"
          >
            <Upload className="size-8" />
          </Label>
          <span className="text-sm text-muted-foreground">
            Click to select an image
          </span>
        </div>
      )}
    </div>
  );
}

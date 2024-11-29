"use client";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";

interface ImageEditorProps {
  imageUrl: string;
  onSave: (croppedImage: Blob) => void;
}

export function ImageEditor({ imageUrl, onSave }: ImageEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = imageUrl;
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
      <div className="relative mt-4 h-60 overflow-hidden rounded-md">
        <Cropper
          image={imageUrl}
          crop={crop}
          cropShape="round"
          zoom={zoom}
          aspect={3 / 3}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <Slider
        value={[zoom]}
        min={1}
        max={3}
        step={0.1}
        onValueChange={(value) => setZoom(value[0] ?? 1)}
      />
      <Button
        onClick={async () => {
          const croppedBlob = await createCroppedImage();
          if (croppedBlob) {
            onSave(croppedBlob);
          }
        }}
      >
        Save Cropped Image
      </Button>
    </div>
  );
}

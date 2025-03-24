
import React, { useState } from 'react';
import { Camera, Image, Loader2, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  className?: string;
  processing?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelect, 
  className,
  processing = false
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const handleFile = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    } else {
      setPreview(null);
      onImageSelect(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div 
      className={cn(
        'relative rounded-lg border-2 border-dashed transition-all duration-200',
        dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {processing && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Analyzing your food...</p>
          </div>
        </div>
      )}
      
      {preview ? (
        <div className="relative h-full w-full">
          <img 
            src={preview} 
            alt="Food preview" 
            className="h-full w-full object-cover rounded-md" 
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="flex flex-col items-center justify-center py-6 px-4 h-full"
          onClick={triggerFileInput}
        >
          <div className="p-3 rounded-full bg-primary/10 mb-3">
            <Image className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium mb-1">Upload food photo</p>
            <p className="text-xs text-muted-foreground mb-3">Drag and drop or click to upload</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
            >
              <Camera className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

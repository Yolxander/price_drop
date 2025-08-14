"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function ImageGalleryModal({
  images,
  isOpen,
  onClose,
  initialIndex = 0
}) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  // Reset current index when modal opens with a new initial index
  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full p-0 bg-black border-0 h-[95vh] overflow-hidden">
        <div className="relative h-full flex flex-col">
          {/* Close button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-black/80 text-white h-12 w-12 rounded-full"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Main carousel */}
          <div className="relative flex-1 overflow-hidden">
            <div className="relative h-full w-full overflow-hidden">
              {images.map((image, index) => (
                <div
                  key={`slide-${index}`}
                  className={cn(
                    "absolute inset-0 transform transition-all duration-500 ease-in-out",
                    index === currentIndex
                      ? "translate-x-0 opacity-100"
                      : index < currentIndex
                        ? "-translate-x-full opacity-0"
                        : "translate-x-full opacity-0",
                  )}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white h-14 w-14 rounded-full"
                  onClick={prevSlide}
                >
                  <ChevronLeftIcon className="h-7 w-7" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white h-14 w-14 rounded-full"
                  onClick={nextSlide}
                >
                  <ChevronRightIcon className="h-7 w-7" />
                </Button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Caption */}
            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
              <p className="text-white text-base font-medium">{images[currentIndex].alt}</p>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="bg-black/40 backdrop-blur-sm border-t border-white/10">
              <div className="flex gap-3 overflow-x-auto px-6 py-4 justify-center">
                {images.map((image, index) => (
                  <button
                    key={`thumb-${index}`}
                    className={cn(
                      "relative h-20 w-20 flex-shrink-0 transition-all duration-200 rounded-lg overflow-hidden border-2",
                      index === currentIndex
                        ? "border-white ring-2 ring-white/50"
                        : "border-transparent hover:border-white/50",
                    )}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <img
                      src={image.src}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

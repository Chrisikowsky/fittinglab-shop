"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductImage {
    id: string;
    url: string;
    alt?: string;
}

interface ProductImageGalleryProps {
    thumbnail: string | null;
    images: ProductImage[];
    title: string;
}

export function ProductImageGallery({ thumbnail, images, title }: ProductImageGalleryProps) {
    // Build the list of all images (thumbnail first, then additional images)
    const allImages: { url: string; alt: string }[] = [];

    if (thumbnail) {
        allImages.push({ url: thumbnail, alt: title });
    }

    if (images && images.length > 0) {
        for (const img of images) {
            // Avoid duplicating the thumbnail
            if (img.url !== thumbnail) {
                allImages.push({ url: img.url, alt: img.alt || title });
            }
        }
    }

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    if (allImages.length === 0) {
        return (
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center border border-slate-100">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                        <ZoomIn className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-400">Kein Bild verfügbar</p>
                </div>
            </div>
        );
    }

    const selectedImage = allImages[selectedIndex];
    const hasMultiple = allImages.length > 1;

    const goTo = (index: number) => {
        setSelectedIndex(index);
        setIsZoomed(false);
    };

    const goPrev = () => goTo(selectedIndex === 0 ? allImages.length - 1 : selectedIndex - 1);
    const goNext = () => goTo(selectedIndex === allImages.length - 1 ? 0 : selectedIndex + 1);

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative group rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-lg shadow-slate-200/30">
                <div
                    className={cn(
                        "relative aspect-[4/3] cursor-zoom-in transition-all duration-300",
                        isZoomed && "aspect-auto min-h-[500px] cursor-zoom-out"
                    )}
                    onClick={() => setIsZoomed(!isZoomed)}
                >
                    <Image
                        src={selectedImage.url}
                        alt={selectedImage.alt}
                        fill
                        className={cn(
                            "transition-transform duration-500",
                            isZoomed ? "object-contain" : "object-cover"
                        )}
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Zoom indicator */}
                    <div className="absolute bottom-4 right-4 w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
                        <ZoomIn className="w-4 h-4 text-slate-500" />
                    </div>
                </div>

                {/* Navigation Arrows */}
                {hasMultiple && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); goPrev(); }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white shadow-md"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-700" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); goNext(); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white shadow-md"
                        >
                            <ChevronRight className="w-5 h-5 text-slate-700" />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {hasMultiple && (
                    <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                        {selectedIndex + 1} / {allImages.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip */}
            {hasMultiple && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                    {allImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => goTo(index)}
                            className={cn(
                                "relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200",
                                index === selectedIndex
                                    ? "border-[#329ebf] ring-2 ring-[#329ebf]/20 shadow-md"
                                    : "border-slate-100 hover:border-slate-200 opacity-60 hover:opacity-100"
                            )}
                        >
                            <Image
                                src={img.url}
                                alt={img.alt}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

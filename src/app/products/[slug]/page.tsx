import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Shield, Truck } from "lucide-react";
import { medusa } from "@/lib/medusa";
import { AddToCartButton } from "@/components/AddToCartButton";

interface PageProps {
    params: {
        slug: string;
    };
}

// Function to fetch product by handle (slug)
async function getProduct(handle: string) {
    try {
        const { products } = await medusa.products.list({
            handle,
            expand: "variants,options,images",
        });

        if (products.length === 0) {
            return null;
        }

        return products[0];
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export default async function ProductPage({ params }: PageProps) {
    const product = await getProduct(params.slug);

    if (!product) {
        notFound();
    }

    // Format price (assuming EUR and 100 cents factor)
    // In a real app, you would handle currency dynamically
    const price = product.variants[0]?.prices[0]?.amount
        ? (product.variants[0].prices[0].amount / 100).toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR",
        })
        : "Preis auf Anfrage";

    // Extract specs from metadata or use defaults
    const specs = product.metadata?.specs as Record<string, string> || {
        "Hersteller": "FittingLab",
        "Garantie": "2 Jahre",
        "Verfügbarkeit": "Auf Lager",
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[var(--background)]">
            <div className="container mx-auto px-6">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-[#329ebf] transition-colors mb-12 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Zurück zur Übersicht
                </Link>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Product Image Gallery */}
                    <div className="space-y-6">
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-xl shadow-slate-200/50">
                            {product.thumbnail && (
                                <Image
                                    src={product.thumbnail}
                                    alt={product.title || "Product Image"}
                                    fill
                                    className="object-contain p-12"
                                    priority
                                />
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                                {product.title}
                            </h1>
                            <p className="text-3xl font-bold text-[#329ebf]">{price}</p>
                        </div>

                        <p className="text-lg text-slate-600 leading-relaxed font-light">
                            {product.description}
                        </p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-4 py-8 border-y border-slate-200">
                            {Object.entries(specs).map(([key, value]) => (
                                <div key={key}>
                                    <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">
                                        {key}
                                    </p>
                                    <p className="text-slate-800 font-medium">{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Add to Cart */}
                        <div className="space-y-4">
                            {/* We assume the first variant is the main one for now */}
                            {product.variants[0]?.id && (
                                <AddToCartButton variantId={product.variants[0].id} />
                            )}

                            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    <span>Kostenloser Versand</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    <span>2 Jahre Garantie</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

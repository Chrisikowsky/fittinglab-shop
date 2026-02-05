import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Shield, Truck } from "lucide-react";
import { sdk } from "@/lib/medusa";
import { AddToCartButton } from "@/components/AddToCartButton";

interface PageProps {
    params: {
        slug: string;
    };
}

async function getProduct(handle: string) {
    try {
        // Try exact handle first
        let { products } = await sdk.store.product.list({
            handle,
            fields: "*variants,*variants.prices,*images,*options",
        });

        // If not found, try adding a leading slash (user case)
        if (products.length === 0) {
            ({ products } = await sdk.store.product.list({
                handle: `/${handle}`,
                fields: "*variants,*variants.prices,*images,*options",
            }));
        }

        // Also try removing slash if handle passed had one
        if (products.length === 0 && handle.startsWith('/')) {
            ({ products } = await sdk.store.product.list({
                handle: handle.substring(1),
                fields: "*variants,*variants.prices,*images,*options",
            }));
        }


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
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    // Default price formatting
    // Medusa 2.0: prices are in `calculated_price` if using cart context, or raw in variants
    // Here we just grab the first EUR price we find for display
    const eurPrice = product.variants?.[0]?.prices?.find((p: any) => p.currency_code === "eur");
    const priceAmount = eurPrice ? eurPrice.amount : 0;

    // Medusa stores amounts in smallest unit (cents)
    const price = priceAmount
        ? (priceAmount).toLocaleString("de-DE", {
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
                                    src={product.thumbnail.startsWith("http") ? product.thumbnail : `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}${product.thumbnail}`}
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
                            {/* We pass the first variant ID */}
                            {product.variants?.[0]?.id && (
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

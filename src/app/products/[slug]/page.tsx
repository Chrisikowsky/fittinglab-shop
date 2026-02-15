import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, Truck, Package, Star } from "lucide-react";
import { sdk } from "@/lib/medusa";
import { ProductActions } from "@/components/ProductActions";
import { ProductImageGallery } from "@/components/ProductImageGallery";

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
    const eurPrice = product.variants?.[0]?.prices?.find((p: any) => p.currency_code === "eur");
    const priceAmount = eurPrice ? eurPrice.amount : 0;

    const price = priceAmount
        ? (priceAmount / 100).toLocaleString("de-DE", {
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

    // Prepare images for gallery
    const galleryImages = (product.images || []).map((img: any) => ({
        id: img.id,
        url: img.url,
        alt: product.title,
    }));

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[var(--background)]">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#329ebf] transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Zurück zur Übersicht
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Product Image Gallery */}
                    <div className="lg:sticky lg:top-28">
                        <ProductImageGallery
                            thumbnail={product.thumbnail}
                            images={galleryImages}
                            title={product.title || "Produkt"}
                        />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Title & Price */}
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3 leading-tight">
                                {product.title}
                            </h1>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-[#329ebf] tabular-nums">{price}</span>
                                <span className="text-sm text-slate-400 font-medium">zzgl. MwSt.</span>
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-base text-slate-500 leading-relaxed">
                                {product.description}
                            </p>
                        )}

                        {/* Specs Grid */}
                        <div className="bg-slate-50/70 rounded-2xl p-5">
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(specs).map(([key, value]) => (
                                    <div key={key}>
                                        <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">
                                            {key}
                                        </p>
                                        <p className="text-sm text-slate-700 font-medium">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="space-y-5">
                            {product.variants?.[0]?.id && (
                                <ProductActions variantId={product.variants[0].id} />
                            )}

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-slate-100">
                                    <Truck className="w-5 h-5 text-[#329ebf]" />
                                    <span className="text-[11px] text-slate-500 font-medium text-center leading-tight">Kostenloser Versand</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-slate-100">
                                    <Shield className="w-5 h-5 text-[#329ebf]" />
                                    <span className="text-[11px] text-slate-500 font-medium text-center leading-tight">2 Jahre Garantie</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-slate-100">
                                    <Package className="w-5 h-5 text-[#329ebf]" />
                                    <span className="text-[11px] text-slate-500 font-medium text-center leading-tight">Schnelle Lieferung</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

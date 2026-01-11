import { products } from "@/data/products";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, ShoppingCart, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Generate static params for all products (optional but good for static export)
export function generateStaticParams() {
    return products.map((product) => ({
        id: product.id.toString(),
    }));
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = products.find((p) => p.id.toString() === id);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800">Produkt nicht gefunden</h1>
                    <Link href="/" className="text-cyan-600 mt-4 inline-block hover:underline">Zurück zur Startseite</Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 py-12 relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-600 transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Zurück zur Übersicht
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Image Section */}
                    <div className={cn("relative rounded-3xl overflow-hidden aspect-square flex items-center justify-center shadow-xl border border-slate-200", product.imageColor)}>
                        {product.imageSrc ? (
                            <Image
                                src={product.imageSrc}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="text-center p-12">
                                <div className="w-48 h-48 bg-white/50 backdrop-blur-md rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                                    <div className="w-24 h-4 bg-slate-300 rounded-full" />
                                </div>
                                <p className="text-slate-400 font-medium">Produktabbildung folgt</p>
                            </div>
                        )}

                        {/* Badge */}
                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-cyan-700 shadow-sm border border-cyan-100">
                            PREMIUM
                        </div>
                    </div>

                    {/* Right: Content Section */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">{product.title}</h1>
                            <p className="text-xl text-slate-500">{product.desc}</p>
                        </div>

                        <div className="flex items-end gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <div>
                                <span className="block text-sm text-slate-400 mb-1">Preis (netto)</span>
                                <span className="text-4xl font-mono font-bold text-cyan-700">{product.price}</span>
                            </div>
                            <button className="ml-auto px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5" /> In den Warenkorb
                            </button>
                        </div>

                        <div className="prose prose-slate max-w-none">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Beschreibung</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {product.longDesc}
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {product.specs.map((spec, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-slate-100 border border-slate-200">
                                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{spec.label}</span>
                                    <span className="font-medium text-slate-700">{spec.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Supported Manufacturers */}
                        {product.supportedManufacturers && (
                            <div className="pt-8 border-t border-slate-200">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Unterstützte Hersteller</h3>
                                <div className="flex flex-wrap gap-8 items-center">
                                    {product.supportedManufacturers.map((manufacturer, idx) => (
                                        <div key={idx} className="relative h-24 w-48 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                                            <Image
                                                src={manufacturer.logo}
                                                alt={manufacturer.name}
                                                fill
                                                className="object-contain mix-blend-multiply"
                                                sizes="(max-width: 768px) 200px, 300px"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Benefits */}
                        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Shield className="w-5 h-5" /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Zertifiziert</h4>
                                    <p className="text-xs text-slate-500">Geprüfte Qualität</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Zap className="w-5 h-5" /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Sofort lieferbar</h4>
                                    <p className="text-xs text-slate-500">Versand in 24h</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

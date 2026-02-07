"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Activity,
    Zap,
    Shield,
    ShoppingCart,
    TrendingUp,
    Users,
    Cpu,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy Data (Static parts can remain here)
const stats = [
    { label: "Umsatzsteigerung", value: "+40%", icon: TrendingUp },
    { label: "Partner-Akustiker", value: "200+", icon: Users },
    { label: "Prozesse digitalisiert", value: "100%", icon: Cpu },
];

const features = [
    {
        icon: Zap,
        title: "Blitzschnelle Diagnose",
        desc: "Spare bis zu 15 Minuten pro Kunde durch automatisierte Workflows.",
    },
    {
        icon: Activity,
        title: "Präzise Messdaten",
        desc: "Hochauflösende Analysen, die kleinste Hördefizite sichtbar machen.",
    },
    {
        icon: Shield,
        title: "DSGVO-Konform",
        desc: "Sichere Cloud-Speicherung mit Serverstandort Deutschland.",
    },
    {
        icon: CheckCircle2,
        title: "Nahtlose Integration",
        desc: "Kompatibel mit Noah und anderen CRM-Systemen.",
    },
];

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface Product {
    id: string;
    handle: string;
    title: string;
    description: string;
    thumbnail: string | null;
    price: string;
    defaultVariantId?: string;
}

interface HomeClientProps {
    products: Product[];
}

import { ProductCard } from "./ProductCard";

export default function HomeClient({ products }: HomeClientProps) {
    return (
        <main className="min-h-screen relative overflow-hidden bg-[var(--background)]">
            {/* Hero Background Image */}
            <div className="absolute inset-0 w-full h-screen z-0 pointer-events-none">
                <Image
                    src="/hero/hero_hitbox_background.jpg"
                    alt="Hero Background"
                    fill
                    className="object-cover opacity-95"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3a6297]/60 via-[#3a6297]/10 to-transparent" />
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 container mx-auto">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-4xl mx-auto flex flex-col items-center text-center"
                >
                    {/* Hero Content */}
                    <div className="space-y-8 z-10 flex flex-col items-center">
                        <motion.h1 variants={itemVariants} className="text-5xl lg:text-8xl font-bold tracking-tight leading-[1.1] text-slate-900">
                            Smarte Tools <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3a6297] to-[#329ebf]">
                                für Hörakustiker
                            </span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-2xl text-slate-100 max-w-lg font-medium leading-relaxed drop-shadow-md">
                            Exklusive Lösungen für inhabergeführte Akustiker, die mehr erreichen wollen. Steigern Sie Produktivität und Kundenzufriedenheit.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                            <button className="px-8 py-4 bg-[#329ebf] hover:bg-[#3a6297] text-white font-bold rounded-lg transition-all hover:scale-105 shadow-lg shadow-[#329ebf]/20">
                                Lösungen entdecken
                            </button>
                            <button className="px-8 py-4 glass-panel hover:bg-white text-slate-700 font-medium rounded-lg transition-all flex items-center gap-2 group border-slate-200">
                                Demo buchen
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Quote Section */}
            <section className="py-24 bg-gradient-to-b from-[#0f233a] to-slate-950 relative overflow-hidden">
                <div className="container mx-auto px-6 text-center z-10 relative">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="max-w-4xl mx-auto"
                    >
                        <h2 className="text-2xl md:text-4xl font-light leading-normal text-white mb-12 min-h-[120px]">
                            {"Moderne Messtechnik und Anpassverfahren mit System haben einen festen Platz in der Hörakustik von Heute und Morgen.".split("").map((char, index) => (
                                <motion.span
                                    key={index}
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1 }
                                    }}
                                    transition={{ duration: 0.01, delay: index * 0.03 }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 3, duration: 0.8 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="w-16 h-1 bg-[#329ebf] rounded-full mb-4" />
                            <p className="text-xl font-bold text-white">Christoph Schulte</p>
                            <p className="text-slate-400 font-medium">Hörakustikmeister, Betriebswirt (HwO)</p>
                            <p className="text-[#329ebf] text-sm uppercase tracking-widest mt-1">Trainer Hörakustik & Audiologie</p>
                        </motion.div>
                    </motion.div>

                    {/* Ambient Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#329ebf]/10 rounded-full blur-3xl pointer-events-none -z-10" />
                </div>
            </section>

            {/* Trust/Stats Bar */}
            <section className="border-y border-slate-200 bg-white/50 backdrop-blur-sm relative z-10">
                <div className="container mx-auto px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200"
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center justify-center text-center p-4">
                                <stat.icon className="w-8 h-8 text-[#329ebf] mb-2 opacity-90" />
                                <span className="text-4xl font-bold text-slate-800">{stat.value}</span>
                                <span className="text-sm text-slate-500 uppercase tracking-wider mt-1 font-semibold">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-24 relative container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4 text-slate-900">Warum <span className="text-[#329ebf]">FittingLab</span>?</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">Technologie, die Ihren Arbeitsalltag revolutioniert und Ihre Kunden begeistert.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="glass-panel p-6 rounded-2xl hover:bg-white transition-all cursor-default shadow-sm hover:shadow-md"
                        >
                            <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center mb-4 text-[#329ebf] border border-slate-100">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Shop Section */}
            <section className="py-24 relative overflow-hidden">
                {/* Subtle background for shop */}
                <div className="absolute inset-0 bg-slate-50/50 -z-10" />

                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-4xl font-bold mb-2 text-slate-900">Hardware & Software <br />für Profis</h2>
                            <p className="text-slate-600">Upgrade your practice with premium tools.</p>
                        </div>
                        <button className="text-[#329ebf] hover:text-[#3a6297] font-medium flex items-center gap-2 transition-colors">
                            Alle Produkte ansehen <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer - Dark Navy for Contrast */}
            <footer className="py-12 bg-slate-900 text-center text-slate-400 text-sm">
                <div className="container mx-auto px-6">
                    <div className="mb-8 flex justify-center opacity-50 grayscale hover:grayscale-0 transition-all">
                        <Image src="/logo-v2.png" alt="Logo" width={120} height={40} className="brightness-0 invert" />
                    </div>
                    <p className="mb-4 text-[#329ebf]">Excellence in Hearing Technology.</p>
                    <p>© {new Date().getFullYear()} FittingLab Tech GmbH. All rights reserved.</p>
                </div>
            </footer>
        </main >
    );
}

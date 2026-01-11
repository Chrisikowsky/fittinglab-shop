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

// Dummy Data
const stats = [
  { label: "Umsatzsteigerung", value: "+40%", icon: TrendingUp },
  { label: "Partner-Akustiker", value: "200+", icon: Users },
  { label: "Prozesse digitalisiert", value: "100%", icon: Cpu },
];

import { products } from "@/data/products";

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

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[var(--background)]">
      {/* Background Decorative Elements - Light Mode optimized */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-cyan-100/50 to-transparent pointer-events-none" />
      <div className="absolute -top-40 right-0 w-[700px] h-[700px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header with Logo */}
      <header className="absolute top-0 left-0 w-full p-6 z-50">
        <div className="container mx-auto">
          <Image src="/logo.png" alt="FittingLab Logo" width={180} height={50} className="object-contain" priority />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 container mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Hero Content */}
          <div className="space-y-8 z-10">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-cyan-700 text-sm font-medium border-cyan-200/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-600"></span>
              </span>
              Next-Gen Acoustics Tech
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-slate-900">
              Smarte Tools <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700">
                für Hörakustiker
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-slate-600 max-w-lg font-light leading-relaxed">
              Exklusive Lösungen für Akustiker, die mehr erreichen wollen. Steigern Sie Produktivität und Kundenzufriedenheit.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all hover:scale-105 shadow-lg shadow-cyan-500/20">
                Lösungen entdecken
              </button>
              <button className="px-8 py-4 glass-panel hover:bg-white text-slate-700 font-medium rounded-lg transition-all flex items-center gap-2 group border-slate-200">
                Demo buchen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Hero Visual (Abstract - Ice Edition) */}
          <motion.div variants={itemVariants} className="relative hidden lg:block h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-80 h-80">
                {/* Cool Ice Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-300/40 to-blue-400/40 rounded-full blur-3xl animate-pulse" />

                {/* Center Object */}
                <div className="absolute inset-0 border border-white/60 rounded-full glass-card flex items-center justify-center bg-white/40 backdrop-blur-xl">
                  <div className="w-40 h-40 bg-white rounded-full border border-cyan-100 flex items-center justify-center shadow-2xl shadow-cyan-200/50">
                    <Activity className="w-16 h-16 text-cyan-600" />
                  </div>
                </div>
                {/* Orbiting Elements */}
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-6 h-6 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
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
                <stat.icon className="w-8 h-8 text-cyan-600 mb-2 opacity-90" />
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
          <h2 className="text-3xl font-bold mb-4 text-slate-900">Warum <span className="text-cyan-600">Audionicks</span>?</h2>
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
              <div className="w-12 h-12 rounded-lg bg-cyan-50 flex items-center justify-center mb-4 text-cyan-600 border border-cyan-100">
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
            <button className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-2 transition-colors">
              Alle Produkte ansehen <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="block group h-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="relative glass-card rounded-2xl overflow-hidden bg-white h-full"
                >
                  {/* Product Image Placeholder - Light & Clean */}
                  <div className={cn("h-48 w-full relative overflow-hidden flex items-center justify-center", product.imageColor)}>
                    {/* @ts-ignore */}
                    {product.imageSrc ? (
                      <Image
                        src={product.imageSrc}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-white/40 flex items-center justify-center backdrop-blur-sm shadow-sm group-hover:scale-110 transition-transform duration-500">
                        {/* Device representation */}
                        <div className="w-16 h-2 bg-white/60 rounded-full shadow-sm" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1 text-slate-800">{product.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 h-10">{product.desc}</p>

                    <div className="flex items-center justify-between mt-6">
                      <span className="text-lg font-mono font-bold text-cyan-700">{product.price} <span className="text-xs text-slate-400 font-normal">netto</span></span>

                      <button className="p-3 bg-slate-100 hover:bg-cyan-600 text-slate-600 hover:text-white rounded-lg transition-all shadow-sm hover:shadow-lg hover:shadow-cyan-500/30">
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Dark Navy for Contrast */}
      <footer className="py-12 bg-slate-900 text-center text-slate-400 text-sm">
        <div className="container mx-auto px-6">
          <div className="mb-8 flex justify-center opacity-50 grayscale hover:grayscale-0 transition-all">
            <Image src="/logo.png" alt="Logo" width={120} height={40} className="brightness-0 invert" />
          </div>
          <p className="mb-4">Excellence in Hearing Technology.</p>
          <p>© {new Date().getFullYear()} Audionicks Tech GmbH. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

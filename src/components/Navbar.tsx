"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ShoppingCart, Menu, X, User, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAccount } from "@/context/AccountContext";

const navLinks = [
    { name: "Produkte", href: "/" },
    { name: "Hören im Abo", href: "#hoeren-im-abo" },
    { name: "Soundgrid Pro", href: "#soundgrid-pro" },
    { name: "Über uns", href: "#about" },
    { name: "Kontakt", href: "#contact" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const pathname = usePathname();
    const { scrollY } = useScroll();

    // The Navbar stays fixed until 200px, then slides up between 200px and 400px
    const navbarY = useTransform(scrollY, [200, 400], [0, -120]);
    // Also fade it slightly as it disappears
    const navbarOpacity = useTransform(scrollY, [200, 400], [1, 0]);

    // Handle scroll for the Top-Button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on path change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const { cart } = useCart();
    const { customer } = useAccount();
    const itemCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

    return (
        <motion.nav
            style={{ y: navbarY, opacity: navbarOpacity }}
            className="absolute top-0 left-0 w-full z-50 py-4 bg-transparent"
        >
            <div className="container mx-auto px-6">
                <div className="relative flex items-center justify-between px-2 py-2 transition-all duration-500">
                    {/* Logo - White version */}
                    <Link href="/" className="relative z-50 flex items-center gap-2">
                        <Image
                            src="/logo.svg"
                            alt="FittingLab Logo"
                            width={160}
                            height={45}
                            className="object-contain transition-transform origin-left"
                            priority
                        />
                    </Link>

                    {/* Desktop Nav - White/Cyan Selection */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "text-lg font-medium transition-all duration-300 hover:text-[#329ebf]",
                                        isActive
                                            ? "text-transparent bg-clip-text bg-gradient-to-r from-[#3a6297] to-[#329ebf] font-bold"
                                            : "text-slate-900 hover:text-[#329ebf]"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Call to Action & Cart */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/cart" className="relative group p-2 flex items-center justify-center">
                            <ShoppingCart className="w-7 h-7 text-slate-800 transition-all duration-300 group-hover:stroke-[var(--hover-color)]" style={{ '--hover-color': 'url(#cyan-gradient)' } as any} />
                            {/* SVG Gradient definition for the icon hover */}
                            <svg width="0" height="0" className="absolute">
                                <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop stopColor="#3a6297" offset="0%" />
                                    <stop stopColor="#329ebf" offset="100%" />
                                </linearGradient>
                            </svg>

                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 bg-[#329ebf] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg border border-white">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        <Link href={customer ? "/account" : "/account/login"} className="px-4 py-2 text-slate-800 text-base font-medium transition-all duration-300 flex items-center gap-2 group hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#3a6297] hover:to-[#329ebf]">
                            <User className="w-5 h-5 text-slate-800 transition-all duration-300 group-hover:stroke-[url(#cyan-gradient)]" />
                            <span>{customer ? "Mein Konto" : "Partner Login"}</span>
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "relative z-50 md:hidden p-2 transition-colors",
                            "text-slate-900"
                        )}
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-[#3a6297] flex flex-col items-center justify-center p-8"
                    >
                        <motion.div
                            className="flex flex-col items-center gap-10"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.1,
                                    }
                                }
                            }}
                        >
                            {navLinks.map((link) => (
                                <motion.div
                                    key={link.name}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                >
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "text-4xl font-bold transition-colors",
                                            pathname === link.href ? "text-[#329ebf]" : "text-white/90 hover:text-white"
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                className="mt-8"
                            >
                                <Link
                                    href={customer ? "/account" : "/account/login"}
                                    onClick={() => setIsOpen(false)}
                                    className="px-12 py-4 rounded-xl border-2 border-white/30 text-white text-xl font-bold inline-block"
                                >
                                    {customer ? "Mein Konto" : "Partner Login"}
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        onClick={scrollToTop}
                        className="fixed bottom-10 right-10 z-[60] p-4 bg-white shadow-2xl rounded-full border border-slate-100 text-[#329ebf] hover:bg-[#329ebf] hover:text-white transition-all group"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

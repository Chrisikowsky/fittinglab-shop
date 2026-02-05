export interface Product {
    id: number;
    handle: string; // Added handle for routing
    title: string;
    desc: string;
    price: string;
    longDesc: string;
    specs: { label: string; value: string }[];
    imageColor: string;
    imageSrc?: string;
    supportedManufacturers?: { name: string; logo: string }[];
}

export const products: Product[] = [
    {
        id: 1,
        handle: "ric-fitting-kit-21", // Actual Medusa Handle
        title: "RICfittingkit 2.1",
        desc: "Adapter-Set für Aurical-Messboxen zur präzisen RIC-Anpassung.",
        price: "189,00 €", // Updated price based on screenshot
        longDesc: "Das RICfittingkit 2.1 ist die ultimative Lösung für Hörakustiker, die präzise Messungen mit Aurical-HIT-Systemen durchführen wollen. Es ermöglicht eine nahtlose Kopplung und sorgt für reproduzierbare Ergebnisse bei jeder Anpassung.Typenreiniger wird nicht mehr benötigt! Dank der robusten Bauweise und des ergonomischen Designs integriert es sich perfekt in Ihren Arbeitsablauf.",
        specs: [
            { label: "Kompatibilität", value: "Aurical HIT" },
            { label: "Material", value: "Hochwertiger Kunststoff (Medizinprodukt-konform)" },
            { label: "Lieferumfang", value: "Adapter-Set, Kurzanleitung, Aufbewahrungsbox" },
            { label: "Garantie", value: "2 Jahre" },
        ],
        supportedManufacturers: [
            { name: "Phonak", logo: "/logos/phonak.png" },
            { name: "Unitron", logo: "/logos/unitron.png" },
            { name: "Starkey", logo: "/logos/starkey.png" },
            { name: "Signia", logo: "/logos/signia.png" },
            { name: "Audio Service", logo: "/logos/audio-service.png" },
            { name: "Widex", logo: "/logos/widex.png" },
            { name: "Bernafon", logo: "/logos/bernafon.png" },
            { name: "Oticon", logo: "/logos/oticon.png" },
        ],
        imageColor: "bg-white",
        imageSrc: "/fitting-kit.jpg",
    },
    {
        id: 3,
        handle: "soundgrid-pro", // Assumed handle
        title: "Soundgrid Pro",
        desc: "Integrierte Software für Klangsimulation & Anpassung.",
        price: "89€ / M",
        longDesc: "Verwandeln Sie Ihren Anpassraum in eine lebendige Klangwelt. Mit der SoundStudio Suite simulieren Sie komplexe akustische Umgebungen – vom ruhigen Wohnzimmer bis zum belebten Restaurant – direkt am PC. Perfekt für die Demonstration von Hörsystem-Features.",
        specs: [
            { label: "Lizenzmodell", value: "Monatliches Abo (kündbar)" },
            { label: "Systemanforderungen", value: "Windows 10/11, min. 8GB RAM" },
            { label: "Klangbibliothek", value: "Über 500 Szenarien" },
            { label: "Updates", value: "Inklusive" },
        ],
        imageColor: "bg-slate-100",
    },
];

export interface Product {
    id: number;
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
        title: "RICfittingkit 2.1",
        desc: "Adapter-Set für Aurical-Messboxen zur präzisen RIC-Anpassung.",
        price: "129€",
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
        id: 2,
        title: "Audiometer AI-Pro",
        desc: "Vollautomatisches Audiometer mit KI-Auswertung.",
        price: "2.499€",
        longDesc: "Erleben Sie die nächste Generation der Audiometrie. Das AI-Pro nutzt fortschrittliche Algorithmen, um Hörtests schneller und genauer denn je durchzuführen. Die automatische Mustererkennung unterstützt Sie bei der Diagnose und schlägt optimale Anpassungsparameter vor.",
        specs: [
            { label: "Frequenzbereich", value: "125 Hz - 16 kHz" },
            { label: "Schnittstellen", value: "USB-C, Bluetooth 5.2, Noahlink Wireless" },
            { label: "KI-Modul", value: "Deep Learning Core v3.0" },
            { label: "Zertifizierung", value: "Medizinprodukt Klasse IIa" },
        ],
        imageColor: "bg-blue-100",
    },
    {
        id: 3,
        title: "SoundStudio Suite",
        desc: "Integrierte Software für Klangsimulation & Anpassung.",
        price: "89€ / M",
        longDesc: "Verwandeln Sie Ihren Anpassraum in eine lebendige Klangwelt. Mit der SoundStudio Suite simulieren Sie komplexe akustische Umgebungen – vom ruhigen Wohnzimmer bis zum belebten Restaurant – direkt am PC. Perfekt für die Demonstration von Hörsystem-Features.",
        specs: [
            { label: "Lizenzmodell", value: "Monatliches Abo (kündbar)" },
            { label: "Systemanforderungen", value: "Windows 10/11, min. 8GB RAM" },
            { label: "Klangbibliothek", value: "Über 500 Szenarien" },
            { label: "Updates", value: "Inklusive" },
        ],
        imageColor: "bg-cyan-100",
    },
];

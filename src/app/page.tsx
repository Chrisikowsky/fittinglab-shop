
import { sdk } from "@/lib/medusa";
import HomeClient from "@/components/HomeClient";

// Force dynamic rendering ensures we always get fresh data from the backend
export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const { products } = await sdk.store.product.list({
      fields: "*variants,*variants.prices,*images,*options",
    });

    return products.map((product: any) => {
      // Price logic: Find EUR price in the first variant
      const eurPrice = product.variants?.[0]?.prices?.find((p: any) => p.currency_code === "eur");
      const priceAmount = eurPrice ? eurPrice.amount : 0;

      const priceFormatted = priceAmount
        ? (priceAmount / 100).toLocaleString("de-DE", {
          style: "currency",
          currency: "EUR",
        })
        : "Preis auf Anfrage";

      // Image URL logic: Try thumbnail, then first image, then null
      // Also handle relative paths for Medusa (uploads are usually relative or absolute URL)
      let imageUrl = product.thumbnail || product.images?.[0]?.url || null;

      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}${imageUrl}`;
      }


      return {
        id: product.id,
        handle: product.handle,
        title: product.title,
        description: product.description || "",
        thumbnail: imageUrl,
        price: priceFormatted,
        defaultVariantId: product.variants?.[0]?.id,
      };
    });
  } catch (error) {
    console.error("Error fetching products for Home Page:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  return <HomeClient products={products} />;
}

import { sdk } from "./src/lib/medusa";

console.log("SDK Store Cart Methods:", Object.keys(sdk.store.cart));
console.log("SDK Store Payment Methods:", Object.keys(sdk.store.payment));

import Medusa from "@medusajs/js-sdk";

const MEDUSA_BACKEND_URL = "https://admin.jarsy.in";

export const medusaSdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: "pk_199acbe06acef239bf53e473ced978c8959a921f4aba920564e570d09b03d7d2",
  auth: {
    type: "jwt",
  },
});

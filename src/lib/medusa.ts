import Medusa from "@medusajs/medusa-js";

const medusa = new Medusa({ 
  baseUrl: "https://admin.jarsy.in", 
  maxRetries: 3 
});

export default medusa;

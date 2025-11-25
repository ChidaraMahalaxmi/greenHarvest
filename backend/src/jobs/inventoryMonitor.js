import Product from "../models/Product.js";
import { sendLowStockEmail } from "../utils/email.js";

export default async function inventoryMonitor() {
  try {
    console.log("Inventory Monitor Running...");

    // find products with low stock (< 10)
    const lowStockProducts = await Product.find({ quantity: { $lt: 10 } });

    if (lowStockProducts.length > 0) {
      for (const product of lowStockProducts) {
        console.log("Low stock alert:", product.name);

        // notify farmer
        try {
          await sendLowStockEmail(
            product.farmer,
            product.name,
            product.quantity
          );
        } catch (emailErr) {
          console.error("Email send error:", emailErr);
        }
      }
    }
  } catch (err) {
    console.error("inventoryMonitor error:", err);
  }
}

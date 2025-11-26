import Product from "../models/Product.js";
import User from "../models/User.js";
import {
  sendLowStockEmail,
  sendRestockedEmail,
} from "../utils/email.js";

export default async function inventoryMonitor() {
  try {
    console.log("Inventory Monitor Running...");

    const products = await Product.find();

    for (const product of products) {
      const threshold = 10;
      const farmer = await User.findById(product.farmer);
      const farmerEmail = farmer?.email || process.env.ADMIN_EMAIL;

      /* ------------------------------
         1. LOW STOCK ALERT (< 10)
      -------------------------------*/
      if (product.quantity > 0 && product.quantity < threshold) {
        if (!product.lowStockAlertSent) {
          console.log("Low stock alert:", product.name);
          await sendLowStockEmail(farmerEmail, product.name, product.quantity);

          product.lowStockAlertSent = true;
          product.outOfStockAlertSent = false;
          product.restockedAlertSent = false;
          await product.save();
        }
      }

      /* ------------------------------
         2. OUT OF STOCK ALERT (== 0)
      -------------------------------*/
      if (product.quantity === 0) {
        if (!product.outOfStockAlertSent) {
          console.log("Out of stock alert:", product.name);
          await sendLowStockEmail(farmerEmail, product.name, 0);

          product.outOfStockAlertSent = true;
          product.lowStockAlertSent = true;
          product.restockedAlertSent = false;
          await product.save();
        }
      }

      /* ------------------------------
         3. RESTOCKED (> threshold)
      -------------------------------*/
      if (product.quantity >= threshold) {
        if (
          (product.lowStockAlertSent || product.outOfStockAlertSent) &&
          !product.restockedAlertSent
        ) {
          console.log("Restocked alert:", product.name);
          await sendRestockedEmail(
            farmerEmail,
            product.name,
            product.quantity
          );

          product.restockedAlertSent = true;

          // reset low-stock alerts for next cycle
          product.lowStockAlertSent = false;
          product.outOfStockAlertSent = false;

          await product.save();
        }
      }
    }
  } catch (err) {
    console.error("inventoryMonitor error:", err);
  }
}

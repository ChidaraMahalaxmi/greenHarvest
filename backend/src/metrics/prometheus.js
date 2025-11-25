// src/metrics/prometheus.js
import client from "prom-client";
const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const orderCounter = new client.Counter({
  name: "order_count",
  help: "Total number of orders placed",
});
export const orderValue = new client.Gauge({
  name: "order_value",
  help: "Value of the last order placed",
});

register.registerMetric(orderCounter);
register.registerMetric(orderValue);
export default register;

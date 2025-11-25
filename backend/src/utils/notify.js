// src/utils/notify.js
import { sendEmail } from "./email.js";

export const notifyAgentAssigned = async (agent, order) => {
  console.log(`Notify: agent ${agent.name} assigned to order ${order._id}`);
  try {
    if (agent.email) {
      await sendEmail({
        to: agent.email,
        subject: `New Delivery Assigned - Order ${order._id}`,
        text: `Hi ${agent.name}, a new delivery is assigned to you. Order id: ${order._id}.`,
      });
    }
  } catch (e) {
    console.error("notifyAgentAssigned error:", e);
  }
};

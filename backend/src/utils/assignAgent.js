// src/utils/assignAgent.js
import DeliveryAgent from "../models/DeliveryAgent.js";
import Order from "../models/Order.js";

/**
 * Pick the best available (active) agent:
 * - choose the active agent with the smallest number of current active deliveries
 * - mark the agent active=false (busy) when assigned
 */
export const assignAvailableAgent = async () => {
  try {
    const agents = await DeliveryAgent.find({ active: true }).lean();
    if (!agents || agents.length === 0) {
      console.log("assignAvailableAgent: no active agents");
      return null;
    }

    // count ongoing (not delivered/canceled) orders per agent
    const counts = await Order.aggregate([
      {
        $match: {
          assignedTo: { $in: agents.map((a) => a._id) },
          orderStatus: { $nin: ["delivered", "canceled"] },
        },
      },
      { $group: { _id: "$assignedTo", cnt: { $sum: 1 } } },
    ]);

    const loadMap = {};
    counts.forEach((c) => {
      if (c._id) loadMap[c._id.toString()] = c.cnt;
    });

    // pick agent with minimum load
    let best = null;
    let min = Infinity;
    for (const a of agents) {
      const id = a._id.toString();
      const cnt = loadMap[id] || 0;
      if (cnt < min) {
        min = cnt;
        best = a;
      }
    }

    if (!best) {
      console.log("assignAvailableAgent: couldn't pick an agent");
      return null;
    }

    // mark agent as busy (active -> false)
    const updated = await DeliveryAgent.findByIdAndUpdate(
      best._id,
      { active: false },
      { new: true }
    );

    console.log(`assignAvailableAgent: assigned ${updated.name} (${updated._id})`);
    console.log(`NOTIFY: Agent ${updated.name} assigned a delivery.`);

    return updated;
  } catch (err) {
    console.error("assignAvailableAgent error:", err);
    return null;
  }
};

/**
 * Release an agent (mark active = true) after delivery or when unassigned.
 * Returns the updated agent doc or null.
 */
export const releaseAgent = async (agentId) => {
  try {
    if (!agentId) return null;
    const agent = await DeliveryAgent.findByIdAndUpdate(
      agentId,
      { active: true },
      { new: true }
    );
    if (!agent) {
      console.log("releaseAgent: agent not found", agentId);
      return null;
    }
    console.log(`releaseAgent: agent ${agent.name} (${agent._id}) is now FREE`);
    console.log(`NOTIFY: Agent ${agent.name} is now available.`);
    return agent;
  } catch (err) {
    console.error("releaseAgent error:", err);
    return null;
  }
};

// Provide legacy name and alias
export const autoAssignAgent = assignAvailableAgent;

export default {
  assignAvailableAgent,
  releaseAgent,
  autoAssignAgent,
};

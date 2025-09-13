import { id, init } from "@instantdb/react";
import schema from "../instant.schema";

// Get the app ID from environment variables
const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID;

if (!APP_ID) {
  throw new Error(
    "NEXT_PUBLIC_INSTANT_APP_ID environment variable is required",
  );
}

// Initialize InstantDB with the schema
const db = init({ appId: APP_ID, schema });

export { id };
export default db;

// Export types for convenience
export type { AppSchema } from "../instant.schema";

// Common query helpers
export const queries = {
  // Get tenant with members and agents
  getTenantWithDetails: (tenantId: string) => ({
    tenants: {
      $: { where: { id: tenantId } },
      members: {},
      agents: {},
      tasks: {
        $: { order: { createdAt: "desc" } },
        agent: {},
        assignedTo: {},
        createdBy: {},
      },
    },
  }),

  // Get member with their tenant and tasks
  getMemberWithTasks: (memberId: string) => ({
    members: {
      $: { where: { id: memberId } },
      tenant: {},
      assignedTasks: {
        $: { order: { createdAt: "desc" } },
        agent: {},
      },
      createdTasks: {
        $: { order: { createdAt: "desc" } },
        agent: {},
      },
    },
  }),

  // Get tasks for a tenant
  getTenantTasks: (tenantId: string, limit = 50) => ({
    tasks: {
      $: {
        where: { "tenant.id": tenantId },
        order: { createdAt: "desc" },
        limit,
      },
      tenant: {},
      agent: {},
      assignedTo: {},
      createdBy: {},
    },
  }),

  // Get all tenants for admin view
  getAllTenants: () => ({
    tenants: {
      $: { order: { createdAt: "desc" } },
      members: {},
      agents: {},
    },
  }),
};

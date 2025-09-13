import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    // Built-in entities
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),

    // Core entities
    tenants: i.entity({
      name: i.string().indexed(),
      domain: i.string().unique().indexed().optional(),
      status: i.string().indexed(), // active, inactive, suspended
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),

    members: i.entity({
      firstName: i.string(),
      lastName: i.string(),
      email: i.string().indexed(),
      phone: i.string().optional(),
      role: i.string().indexed(), // user, manager, owner
      status: i.string().indexed(), // active, inactive
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),

    admins: i.entity({
      firstName: i.string(),
      lastName: i.string(),
      email: i.string().unique().indexed(),
      role: i.string().indexed(), // superadmin, admin, support
      permissions: i.string().optional(), // JSON string of permissions
      status: i.string().indexed(), // active, inactive
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),

    agents: i.entity({
      name: i.string().indexed(),
      description: i.string().optional(),
      type: i.string().indexed(), // voice, chat, email
      configuration: i.string().optional(), // JSON string of agent config
      status: i.string().indexed(), // active, inactive, training
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),

    tasks: i.entity({
      type: i.string().indexed(), // call, email, other
      status: i.string().indexed(), // pending, in_progress, completed, failed
      priority: i.string().indexed(), // low, medium, high, urgent
      fromAddress: i.string().indexed(), // phone number or email address
      toAddress: i.string().indexed(), // phone number or email address
      subject: i.string().optional(), // for emails or task description
      content: i.string().optional(), // task content/body
      metadata: i.string().optional(), // JSON string for additional data
      scheduledAt: i.number().indexed().optional(),
      startedAt: i.number().indexed().optional(),
      completedAt: i.number().indexed().optional(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
  },

  links: {
    // User relationships
    userMembers: {
      forward: { on: "members", has: "one", label: "user" },
      reverse: { on: "$users", has: "one", label: "member" },
    },

    userAdmins: {
      forward: { on: "admins", has: "one", label: "user" },
      reverse: { on: "$users", has: "one", label: "admin" },
    },

    // Tenant relationships
    tenantMembers: {
      forward: { on: "members", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "members" },
    },

    tenantAgents: {
      forward: { on: "agents", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "agents" },
    },

    tenantTasks: {
      forward: { on: "tasks", has: "one", label: "tenant" },
      reverse: { on: "tenants", has: "many", label: "tasks" },
    },

    // Task relationships
    taskAgent: {
      forward: { on: "tasks", has: "one", label: "agent" },
      reverse: { on: "agents", has: "many", label: "tasks" },
    },

    taskAssignedMember: {
      forward: { on: "tasks", has: "one", label: "assignedTo" },
      reverse: { on: "members", has: "many", label: "assignedTasks" },
    },

    taskCreatedByMember: {
      forward: { on: "tasks", has: "one", label: "createdBy" },
      reverse: { on: "members", has: "many", label: "createdTasks" },
    },

    taskCreatedByAdmin: {
      forward: { on: "tasks", has: "one", label: "createdByAdmin" },
      reverse: { on: "admins", has: "many", label: "createdTasks" },
    },
  },

  rooms: {
    // Tenant-specific rooms for real-time features
    tenant: {
      presence: i.entity({
        userId: i.string(),
        userType: i.string(), // member, admin
        lastSeen: i.number(),
      }),
      topics: {
        taskUpdates: i.entity({
          taskId: i.string(),
          action: i.string(), // created, updated, completed
          userId: i.string(),
          timestamp: i.number(),
        }),
        notifications: i.entity({
          type: i.string(),
          message: i.string(),
          userId: i.string(),
          timestamp: i.number(),
        }),
      },
    },

    // Global admin room
    admin: {
      presence: i.entity({
        adminId: i.string(),
        lastSeen: i.number(),
      }),
      topics: {
        systemAlerts: i.entity({
          type: i.string(),
          message: i.string(),
          severity: i.string(),
          timestamp: i.number(),
        }),
      },
    },
  },
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;

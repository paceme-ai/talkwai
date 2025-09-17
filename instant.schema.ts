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

      // Business addresses
      physicalAddress: i.string().optional(),
      mailingAddress: i.string().optional(),
      mailingAddressSameAsPhysical: i.boolean().optional(),
      legalAddress: i.string().optional(),
      legalAddressSameAsPhysical: i.boolean().optional(),

      // Business details
      industry: i.string().indexed().optional(),
      servicesOffered: i.string().optional(), // JSON array
      serviceAreaType: i.string().optional(), // city, zip, radius
      serviceAreaValue: i.string().optional(),
      serviceRadius: i.number().optional(),

      // Operations
      hoursOfOperation: i.string().optional(), // JSON object
      afterHoursHandling: i.string().optional(), // voicemail, forward, emergency

      // Lead capture and appointments
      leadCaptureFields: i.string().optional(), // JSON array
      appointmentSlotLength: i.number().optional(),
      appointmentBuffer: i.number().optional(),
      calendarIntegration: i.string().optional(),

      // Compliance
      complianceSettings: i.string().optional(), // JSON object

      // Phone settings
      preferredAreaCodes: i.string().optional(), // JSON array
      greetingScript: i.string().optional(),

      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),

    members: i.entity({
      firstName: i.string(),
      lastName: i.string(),
      email: i.string().indexed(),
      phone: i.string().optional(),
      phoneType: i.string().optional(), // Mobile, Home, Work, Other
      role: i.string().indexed(), // user, manager, owner
      status: i.string().indexed(), // active, inactive

      // Additional member fields
      title: i.string().optional(), // job title/position
      phone2: i.string().optional(),
      phone2Type: i.string().optional(), // Mobile, Home, Work, Other
      phone3: i.string().optional(),
      phone3Type: i.string().optional(), // Mobile, Home, Work, Other
      notificationPreferences: i.string().optional(), // JSON object: {text: bool, email: bool, app: bool}
      escalationInstructions: i.string().optional(),
      authMethod: i.string().indexed().optional(), // google, magic_code

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

      // Call-specific metadata fields
      agentCallId: i.string().indexed().optional(), // Cartesia call ID for voice calls
      callStatus: i.string().indexed().optional(), // dialing, in_progress, completed, failed, no_answer
      callDirection: i.string().indexed().optional(), // inbound, outbound
      callDuration: i.number().indexed().optional(), // call duration in seconds
      callStartTime: i.number().indexed().optional(), // actual call start timestamp
      callEndTime: i.number().indexed().optional(), // actual call end timestamp
      callEndReason: i.string().optional(), // hangup reason: user_hangup, agent_hangup, timeout, error
      callRecordingUrl: i.string().optional(), // URL to call recording
      callTranscript: i.string().optional(), // full call transcript
      transcriptJson: i.string().optional(), // turn-by-turn transcript as JSON
      callSummary: i.string().optional(), // AI-generated call summary
      callSentiment: i.string().optional(), // positive, negative, neutral
      callSuccessful: i.boolean().optional(), // whether call achieved its goal
      callCost: i.number().optional(), // cost of the call in cents

      // Lead information from voice agent completion
      leadsCompany: i.string().optional(),
      leadsDomain: i.string().optional(),
      leadsAddress: i.string().optional(),
      leadsIndustry: i.string().indexed().optional(),
      leadsHoursOfOperation: i.string().optional(),
      leadsInterestLevel: i.string().indexed().optional(), // low, medium, high
      leadsPainPoints: i.string().optional(), // JSON array
      leadsNextSteps: i.string().optional(),
      leadsNotes: i.string().optional(),

      // Research information from voice agent completion
      researchCompanyOverview: i.string().optional(),
      researchPainPoints: i.string().optional(), // JSON array
      researchKeyPeople: i.string().optional(), // JSON array
      researchSalesOpportunities: i.string().optional(), // JSON array

      // Submission metadata
      submissionType: i.string().indexed().optional(), // voice_agent_completion, manual, etc.

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

    taskAudioFile: {
      forward: { on: "tasks", has: "one", label: "audioFile" },
      reverse: { on: "$files", has: "one", label: "task" },
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

# TalkwAI InstantDB Schema

This document describes the InstantDB schema designed for the TalkwAI platform, supporting multi-tenant architecture with clients, users, admins, AI agents, and task management.

## Schema Overview

The schema is organized around five main entity types:

### Core Entities

#### 1. **Tenants** (Your Clients)
- `name`: Client company name
- `domain`: Optional company domain for email validation
- `status`: active, inactive, suspended
- `createdAt`, `updatedAt`: Timestamps

#### 2. **Members** (Client's Users)
- `firstName`, `lastName`: User names
- `email`: User email (indexed for fast lookup)
- `phone`: Optional phone number
- `role`: user, manager, owner (within tenant)
- `status`: active, inactive
- `createdAt`, `updatedAt`: Timestamps

#### 3. **Admins** (TalkwAI Superusers)
- `firstName`, `lastName`: Admin names
- `email`: Unique admin email
- `role`: superadmin, admin, support
- `permissions`: JSON string of specific permissions
- `status`: active, inactive
- `createdAt`, `updatedAt`: Timestamps

#### 4. **Agents** (TalkwAI AIs)
- `name`: Agent display name
- `description`: Optional agent description
- `type`: voice, chat, email
- `configuration`: JSON string of agent settings
- `status`: active, inactive, training
- `createdAt`, `updatedAt`: Timestamps

#### 5. **Tasks** (Call/Email/Other Tasks)
- `type`: call, email, other
- `status`: pending, in_progress, completed, failed
- `priority`: low, medium, high, urgent
- `fromAddress`: Phone number or email address
- `toAddress`: Phone number or email address
- `subject`: Optional subject/description
- `content`: Optional task content/body
- `metadata`: JSON string for additional data
- `scheduledAt`, `startedAt`, `completedAt`: Optional timestamps
- `createdAt`, `updatedAt`: Timestamps

## Relationships

### User Authentication
- `userMembers`: Links `$users` to `members` (1:1)
- `userAdmins`: Links `$users` to `admins` (1:1)

### Tenant Relationships
- `tenantMembers`: Each member belongs to one tenant
- `tenantAgents`: Each agent belongs to one tenant
- `tenantTasks`: Each task belongs to one tenant

### Task Management
- `taskAgent`: Each task can be handled by one agent
- `taskAssignedMember`: Each task can be assigned to one member
- `taskCreatedByMember`: Track which member created the task
- `taskCreatedByAdmin`: Track which admin created the task

## Real-time Features

### Tenant Rooms
Each tenant has its own room for real-time collaboration:
- **Presence**: Track online members and admins
- **Task Updates**: Real-time task status changes
- **Notifications**: In-app notifications

### Admin Room
Global admin room for system management:
- **Presence**: Track online admins
- **System Alerts**: System-wide notifications

## Usage Examples

### Basic Setup

```typescript
import db from './lib/db';
import { id } from '@instantdb/react';

// Create a new tenant
const createTenant = async (name: string, domain?: string) => {
  await db.transact(
    db.tx.tenants[id()].update({
      name,
      domain,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  );
};

// Create a member for a tenant
const createMember = async (tenantId: string, userData: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'manager' | 'owner';
}) => {
  const memberId = id();
  await db.transact(
    db.tx.members[memberId]
      .update({
        ...userData,
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      .link({ tenant: tenantId })
  );
};

// Create a task
const createTask = async (taskData: {
  tenantId: string;
  agentId?: string;
  assignedToId?: string;
  createdById?: string;
  type: 'call' | 'email' | 'other';
  fromAddress: string;
  toAddress: string;
  subject?: string;
  content?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}) => {
  const taskId = id();
  const tx = db.tx.tasks[taskId].update({
    type: taskData.type,
    status: 'pending',
    priority: taskData.priority || 'medium',
    fromAddress: taskData.fromAddress,
    toAddress: taskData.toAddress,
    subject: taskData.subject,
    content: taskData.content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  
  // Link to tenant
  tx.link({ tenant: taskData.tenantId });
  
  // Link to agent if specified
  if (taskData.agentId) {
    tx.link({ agent: taskData.agentId });
  }
  
  // Link to assigned member if specified
  if (taskData.assignedToId) {
    tx.link({ assignedTo: taskData.assignedToId });
  }
  
  // Link to creator if specified
  if (taskData.createdById) {
    tx.link({ createdBy: taskData.createdById });
  }
  
  await db.transact(tx);
};
```

### Querying Data

```typescript
// Get tenant with all related data
const { data } = db.useQuery({
  tenants: {
    $: { where: { id: tenantId } },
    members: {
      $: { where: { status: 'active' } },
    },
    agents: {},
    tasks: {
      $: { 
        order: { createdAt: 'desc' },
        limit: 20,
      },
      agent: {},
      assignedTo: {},
    },
  },
});

// Get tasks for a specific member
const { data: memberTasks } = db.useQuery({
  tasks: {
    $: { 
      where: { 'assignedTo.id': memberId },
      order: { createdAt: 'desc' },
    },
    tenant: {},
    agent: {},
  },
});

// Get all pending tasks for a tenant
const { data: pendingTasks } = db.useQuery({
  tasks: {
    $: {
      where: {
        and: [
          { 'tenant.id': tenantId },
          { status: 'pending' }
        ]
      },
      order: { createdAt: 'desc' },
    },
    agent: {},
    assignedTo: {},
  },
});
```

### Real-time Features

```typescript
// Join tenant room for real-time updates
const tenantRoom = db.room('tenant', tenantId);

// Track presence
const { peers } = db.rooms.usePresence(tenantRoom);

// Listen for task updates
db.rooms.useTopicEffect(tenantRoom, 'taskUpdates', (update) => {
  console.log('Task updated:', update);
  // Handle real-time task updates
});

// Send task update notification
const notifyTaskUpdate = (taskId: string, action: string, userId: string) => {
  db.rooms.publishTopic(tenantRoom, 'taskUpdates', {
    taskId,
    action,
    userId,
    timestamp: Date.now(),
  });
};
```

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Get your InstantDB app ID from https://instantdb.com/dash
3. Set `NEXT_PUBLIC_INSTANT_APP_ID` in your environment file
4. For admin operations, also set `INSTANT_ADMIN_TOKEN`

## Next Steps

1. Set up your InstantDB app at https://instantdb.com
2. Configure your environment variables
3. Use the schema in your components with the provided query helpers
4. Implement authentication using InstantDB's auth system
5. Add real-time features using rooms and topics

This schema provides a solid foundation for a multi-tenant SaaS platform with comprehensive task management and real-time collaboration features.
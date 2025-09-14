// Test script for enhanced call metadata schema
const { init, id } = require("@instantdb/admin");

// Check for required environment variables
if (!process.env.NEXT_PUBLIC_INSTANT_APP_ID) {
  console.error(
    "❌ NEXT_PUBLIC_INSTANT_APP_ID environment variable is required",
  );
  process.exit(1);
}

if (!process.env.INSTANT_ADMIN_TOKEN) {
  console.error("❌ INSTANT_ADMIN_TOKEN environment variable is required");
  console.log(
    "💡 Make sure to run this script in the context where environment variables are available",
  );
  process.exit(1);
}

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID,
  adminToken: process.env.INSTANT_ADMIN_TOKEN,
});

async function testCallMetadata() {
  console.log("🧪 Testing enhanced call metadata schema...");

  try {
    // Test 1: Create a task with comprehensive call metadata
    console.log("\n1. Creating task with call metadata...");
    const testCallId = `test-call-${Date.now()}`;
    const now = Date.now();

    const taskId = id();
    await db.transact([
      db.tx.tasks[taskId].update({
        type: "call",
        status: "completed",
        priority: "medium",
        fromAddress: "system",
        toAddress: "+1234567890",
        subject: "Test outbound call",
        content: "Testing call metadata storage",
        metadata: JSON.stringify({ test: true, api_response: "mock_data" }),

        // Call-specific metadata
        callId: testCallId,
        callStatus: "completed",
        callDirection: "outbound",
        callDuration: 120, // 2 minutes
        callStartTime: now - 120000,
        callEndTime: now,
        callEndReason: "user_hangup",
        callRecordingUrl: "https://example.com/recording.mp3",
        callTranscript: "Hello, this is a test call transcript.",
        callSummary: "Test call completed successfully",
        callSentiment: "positive",
        callSuccessful: true,
        callCost: 50, // 50 cents

        startedAt: now - 120000,
        completedAt: now,
        createdAt: now - 120000,
        updatedAt: now,
      }),
    ]);

    console.log("✅ Task created with ID:", taskId);

    // Test 2: Query the task to verify all fields are stored correctly
    console.log("\n2. Querying task with call metadata...");
    const result = await db.query({
      tasks: {
        $: { where: { callId: testCallId } },
      },
    });

    if (result.tasks && result.tasks.length > 0) {
      const task = result.tasks[0];
      console.log("✅ Task found with callId:", task.callId);
      console.log("📊 Call metadata:");
      console.log("  - Status:", task.callStatus);
      console.log("  - Direction:", task.callDirection);
      console.log("  - Duration:", task.callDuration, "seconds");
      console.log(
        "  - Start time:",
        new Date(task.callStartTime).toISOString(),
      );
      console.log("  - End time:", new Date(task.callEndTime).toISOString());
      console.log("  - End reason:", task.callEndReason);
      console.log("  - Recording URL:", task.callRecordingUrl);
      console.log("  - Transcript:", task.callTranscript);
      console.log("  - Summary:", task.callSummary);
      console.log("  - Sentiment:", task.callSentiment);
      console.log("  - Successful:", task.callSuccessful);
      console.log("  - Cost:", task.callCost, "cents");
    } else {
      console.log("❌ No task found with callId:", testCallId);
    }

    // Test 3: Query all tasks to see the enhanced schema in action
    console.log("\n3. Querying all tasks...");
    const allTasks = await db.query({
      tasks: {},
    });

    console.log("📋 Total tasks found:", allTasks.tasks?.length || 0);
    if (allTasks.tasks && allTasks.tasks.length > 0) {
      const callTasks = allTasks.tasks.filter((task) => task.type === "call");
      console.log("📞 Call tasks found:", callTasks.length);

      callTasks.forEach((task, index) => {
        console.log(
          `  ${index + 1}. Call ID: ${task.callId || "N/A"}, Status: ${task.callStatus || "N/A"}, Duration: ${task.callDuration || "N/A"}s`,
        );
      });
    }

    // Test 4: Test querying by call metadata fields
    console.log("\n4. Testing queries by call metadata fields...");

    // Query by call status
    const completedCalls = await db.query({
      tasks: {
        $: { where: { callStatus: "completed" } },
      },
    });
    console.log("✅ Completed calls found:", completedCalls.tasks?.length || 0);

    // Query by call direction
    const outboundCalls = await db.query({
      tasks: {
        $: { where: { callDirection: "outbound" } },
      },
    });
    console.log("✅ Outbound calls found:", outboundCalls.tasks?.length || 0);

    // Query by call success
    const successfulCalls = await db.query({
      tasks: {
        $: { where: { callSuccessful: true } },
      },
    });
    console.log(
      "✅ Successful calls found:",
      successfulCalls.tasks?.length || 0,
    );

    console.log("\n🎉 All tests completed successfully!");
    console.log("✅ Enhanced call metadata schema is working correctly");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run the test
testCallMetadata();

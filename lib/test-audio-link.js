import { init } from "@instantdb/admin";

// Use the actual values from .env.local
const db = init({
  appId: "0bf33d0f-c11a-4c38-8581-ae245e128898",
  adminToken: "55e25be3-8ef1-49a9-91b1-01f08d77b67b",
});

async function testAudioLink() {
  try {
    // First, let's see all tasks
    const { data: allTasks } = await db.query({
      tasks: {
        audioFile: {},
      },
    });

    console.log("All tasks:", JSON.stringify(allTasks, null, 2));

    // Query for tasks with the specific call ID
    const { data } = await db.query({
      tasks: {
        $: { where: { callId: "ac_CAe5032cd8aeadc3cb977b0be253809e58" } },
        audioFile: {},
      },
    });

    console.log("Tasks with specific call ID:", JSON.stringify(data, null, 2));

    if (data?.tasks?.length > 0) {
      const task = data.tasks[0];
      if (task.audioFile) {
        console.log("✅ Audio file successfully linked to task!");
        console.log("File ID:", task.audioFile.id);
        console.log("File URL:", task.audioFile.url);
      } else {
        console.log("❌ No audio file linked to task");
      }
    } else {
      console.log("❌ No task found for this call ID");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testAudioLink();

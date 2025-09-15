import { init } from "@instantdb/admin";
import { NextResponse } from "next/server";

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID,
  adminToken: process.env.INSTANT_ADMIN_TOKEN,
});

export async function GET(_request, { params }) {
  try {
    const { callId } = await params;
    const agentCallId = callId;

    if (!agentCallId) {
      return NextResponse.json(
        { error: "Call ID is required" },
        { status: 400 },
      );
    }

    const cartesiaApiKey = process.env.CARTESIA_API_KEY;

    if (!cartesiaApiKey) {
      return NextResponse.json(
        { error: "CARTESIA_API_KEY not configured" },
        { status: 500 },
      );
    }

    // Check if audio is already linked to avoid re-downloading
    try {
      const existingTasks = await db.query({
        tasks: {
          $: { where: { agentCallId: agentCallId } },
          audioFile: {},
        },
      });

      const existingTask = existingTasks?.tasks?.[0];
      if (existingTask?.audioFile) {
        // Audio already exists, return early
        return NextResponse.json({
          success: true,
          message: "Audio file already exists",
          audioAvailable: true,
          file: {
            id: existingTask.audioFile.id,
            path: existingTask.audioFile.path,
            url: existingTask.audioFile.url,
            agentCallId: agentCallId,
          },
        });
      }
    } catch (checkError) {
      console.error("Failed to check existing audio:", checkError);
      // Continue with download if check fails
    }

    // Download audio from Cartesia API
    const response = await fetch(
      `https://agents-preview.cartesia.ai/agents/calls/${agentCallId}/audio`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cartesiaApiKey}`,
          "Cartesia-Version": "2025-04-16",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Cartesia API error:", errorData);
      return NextResponse.json(
        { error: "Failed to download call audio" },
        { status: response.status },
      );
    }

    // Get the audio data as array buffer
    const audioData = await response.arrayBuffer();

    // Convert to File object for InstantDB storage
    const audioFile = new File([audioData], `call-${agentCallId}.wav`, {
      type: "audio/wav",
    });

    // Upload to InstantDB $files
    const filePath = `calls/${agentCallId}/audio.wav`;
    const { data: fileData } = await db.storage.uploadFile(filePath, audioFile);

    // Find the task associated with this call and link the audio file
    try {
      const tasks = await db.query({
        tasks: {
          $: { where: { agentCallId: agentCallId } },
        },
      });

      if (tasks?.tasks?.length > 0) {
        const task = tasks.tasks[0];
        await db.transact([
          db.tx.tasks[task.id].link({ audioFile: fileData.id }),
        ]);
      }
    } catch (linkError) {
      console.error("Failed to link audio file to task:", linkError);
      // Don't fail the request if linking fails
    }

    return NextResponse.json({
      success: true,
      message: "Audio file uploaded successfully",
      audioAvailable: true,
      file: {
        id: fileData.id,
        path: fileData.path,
        url: fileData.url,
        agentCallId: agentCallId,
      },
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import { init } from "@instantdb/admin";
import { NextResponse } from "next/server";

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID,
  adminToken: process.env.INSTANT_ADMIN_TOKEN,
});

export async function GET(request, { params }) {
  try {
    const { callId } = await params;
    const agentCallId = callId;
    const url = new URL(request.url);
    const withAudio = url.searchParams.get("withAudio") === "1";

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

    // Get call information using Cartesia REST API
    const response = await fetch(
      `https://api.cartesia.ai/agents/calls/${agentCallId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cartesiaApiKey}`,
          "Cartesia-Version": "2025-04-16",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Cartesia API error: ${response.status} ${errorText}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Find the existing task
    const tasks = await db.query({
      tasks: {
        $: { where: { agentCallId: agentCallId } },
        audioFile: {},
      },
    });

    const existingTask = tasks.tasks?.[0];
    let audioAvailable = false;
    let audioFileUrl = null;

    // Check if we already have audio linked
    if (existingTask?.audioFile) {
      audioAvailable = true;
      audioFileUrl = existingTask.audioFile.url;
    }

    // Process transcript data
    let transcriptText = "";
    let transcriptJson = null;
    if (data.transcript && Array.isArray(data.transcript)) {
      // Assemble transcript text as "role: text" lines
      transcriptText = data.transcript
        .map((turn) => `${turn.role || "unknown"}: ${turn.text || ""}`)
        .join("\n");
      transcriptJson = JSON.stringify(data.transcript);
    }

    // Calculate duration in seconds
    let duration = 0;
    let callStartTime = null;
    let callEndTime = null;

    if (data.start_time) {
      callStartTime = new Date(data.start_time).getTime();
    }
    if (data.end_time) {
      callEndTime = new Date(data.end_time).getTime();
    }
    if (callStartTime && callEndTime) {
      duration = Math.round((callEndTime - callStartTime) / 1000);
    }

    // Map call status to task status
    let taskStatus = "in_progress";
    let completedAt = null;
    const isTerminal = data.status === "completed" || data.status === "ended";
    const isFailed = data.status === "failed" || data.status === "error";

    if (isTerminal) {
      taskStatus = "completed";
      completedAt = Date.now();
    } else if (isFailed) {
      taskStatus = "failed";
    }

    // Prepare update data
    const updateData = {
      metadata: JSON.stringify(data),
      callStatus: data.status,
      callDuration: duration,
      callStartTime,
      callEndTime,
      callEndReason: data.end_reason,
      callRecordingUrl: data.recording_url,
      transcriptText,
      transcriptJson,
      callSummary: data.summary,
      callSentiment: data.sentiment,
      callSuccessful: data.successful,
      callCost: data.cost,
      status: taskStatus,
      updatedAt: Date.now(),
    };

    if (completedAt) {
      updateData.completedAt = completedAt;
    }

    // Update task in database
    try {
      if (existingTask) {
        await db.transact([db.tx.tasks[existingTask.id].update(updateData)]);
      }
    } catch (dbError) {
      console.error("Failed to update task in database:", dbError);
    }

    // Handle withAudio parameter - fetch audio if call is terminal and no audio exists
    if (withAudio && isTerminal && !audioAvailable) {
      try {
        const audioResponse = await fetch(
          `${request.url.split("/api/call/")[0]}/api/call/${agentCallId}/audio`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (audioResponse.ok) {
          const audioData = await audioResponse.json();
          if (audioData.success && audioData.file) {
            audioAvailable = true;
            audioFileUrl = audioData.file.url;
          }
        }
      } catch (audioError) {
        console.error("Failed to fetch audio:", audioError);
      }
    }

    // Return normalized response
    return NextResponse.json({
      success: true,
      status: data.status,
      duration,
      startTime: callStartTime,
      endTime: callEndTime,
      fromAddress: data.from_address,
      toAddress: data.to_address,
      direction: data.direction || "outbound",
      callSid: data.call_sid,
      transcriptAvailable: !!transcriptText,
      summary: data.summary,
      sentiment: data.sentiment,
      endReason: data.end_reason,
      cost: data.cost,
      audioAvailable,
      audioFileUrl,
      data,
    });
  } catch (error) {
    console.error("API route error:", error);

    // Handle Cartesia-specific errors
    if (error.statusCode) {
      return NextResponse.json(
        { error: "Failed to get call information" },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

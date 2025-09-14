import { init } from "@instantdb/admin";
import { NextResponse } from "next/server";

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID,
  adminToken: process.env.INSTANT_ADMIN_TOKEN,
});

export async function GET(_request, { params }) {
  try {
    const { callId } = await params;

    if (!callId) {
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
      `https://api.cartesia.ai/agents/calls/${callId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cartesiaApiKey}`,
          "Cartesia-Version": "2024-11-13",
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

    // Update task in database with latest call information
    try {
      if (data && callId) {
        const updateData = {
          metadata: JSON.stringify(data),
          updatedAt: Date.now(),
        };

        // Add call-specific fields if available
        if (data.status) {
          updateData.callStatus = data.status;
        }
        if (data.duration) {
          updateData.callDuration = data.duration;
        }
        if (data.start_time) {
          updateData.callStartTime = new Date(data.start_time).getTime();
        }
        if (data.end_time) {
          updateData.callEndTime = new Date(data.end_time).getTime();
        }
        if (data.end_reason) {
          updateData.callEndReason = data.end_reason;
        }
        if (data.recording_url) {
          updateData.callRecordingUrl = data.recording_url;
        }
        if (data.transcript) {
          updateData.callTranscript = data.transcript;
        }
        if (data.summary) {
          updateData.callSummary = data.summary;
        }
        if (data.sentiment) {
          updateData.callSentiment = data.sentiment;
        }
        if (data.successful !== undefined) {
          updateData.callSuccessful = data.successful;
        }
        if (data.cost) {
          updateData.callCost = data.cost;
        }

        // Update task status based on call status
        if (data.status === "completed" || data.status === "ended") {
          updateData.status = "completed";
          updateData.completedAt = Date.now();
        } else if (data.status === "failed" || data.status === "error") {
          updateData.status = "failed";
        }

        // Find and update the task with this callId
        const tasks = await db.query({
          tasks: {
            $: { where: { callId: callId } },
          },
        });

        if (tasks.tasks && tasks.tasks.length > 0) {
          const taskId = tasks.tasks[0].id;
          await db.transact([db.tx.tasks[taskId].update(updateData)]);
        }
      }
    } catch (dbError) {
      console.error("Failed to update task in database:", dbError);
      // Don't fail the API call if database update fails
    }

    return NextResponse.json({
      success: true,
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

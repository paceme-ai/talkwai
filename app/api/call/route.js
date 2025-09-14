import { NextResponse } from "next/server";
import { init } from "@instantdb/admin";

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID,
  adminToken: process.env.INSTANT_ADMIN_TOKEN,
});

export async function POST(request) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    const cartesiaApiKey = process.env.CARTESIA_API_KEY;
    const agentId = process.env.YOUR_AGENT_ID;

    if (!cartesiaApiKey) {
      return NextResponse.json(
        { error: "CARTESIA_API_KEY not configured" },
        { status: 500 },
      );
    }

    if (!agentId) {
      return NextResponse.json(
        { error: "YOUR_AGENT_ID not configured" },
        { status: 500 },
      );
    }

    // Make the call to Cartesia API
    const response = await fetch(
      "https://agents-preview.cartesia.ai/twilio/call/outbound",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cartesiaApiKey}`,
          "Cartesia-Version": "2025-04-16",
        },
        body: JSON.stringify({
          target_numbers: [phoneNumber],
          agent_id: agentId,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Cartesia API error:", errorData);
      return NextResponse.json(
        { error: "Failed to initiate call" },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Store call information in InstantDB
    try {
      const callId = data.call_id || data.id; // Cartesia might return call_id or id
      if (callId) {
        const now = Date.now();
        await db.transact([
          db.tx.tasks[db.id()].update({
            type: "call",
            status: "in_progress",
            priority: "medium",
            fromAddress: "system", // or get from user context
            toAddress: phoneNumber,
            subject: "Outbound call",
            content: `Call initiated to ${phoneNumber}`,
            metadata: JSON.stringify(data), // Store full Cartesia response
            
            // Call-specific metadata
            callId: callId,
            callStatus: "dialing", // Initial status when call is created
            callDirection: "outbound",
            callStartTime: now, // When call was initiated
            
            startedAt: now,
            createdAt: now,
            updatedAt: now,
          }),
        ]);
      }
    } catch (dbError) {
      console.error("Failed to store call in database:", dbError);
      // Don't fail the API call if database storage fails
    }

    return NextResponse.json({
      success: true,
      message: "Call initiated successfully",
      data,
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

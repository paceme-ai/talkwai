import { id, init } from "@instantdb/admin";
import { NextResponse } from "next/server";

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID,
  adminToken: process.env.INSTANT_ADMIN_TOKEN,
});

export async function POST(request) {
  try {
    const { phone, companyName, contactName, email } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    const cartesiaApiKey = process.env.CARTESIA_API_KEY;
    const agentId = process.env.YOUR_AGENT_ID;

    console.log(
      "Environment check - CARTESIA_API_KEY:",
      cartesiaApiKey ? "[SET]" : "[NOT SET]",
    );
    console.log(
      "Environment check - YOUR_AGENT_ID:",
      agentId ? "[SET]" : "[NOT SET]",
    );

    if (!cartesiaApiKey) {
      console.log("Missing CARTESIA_API_KEY");
      return NextResponse.json(
        { error: "CARTESIA_API_KEY not configured" },
        { status: 500 },
      );
    }

    if (!agentId) {
      console.log("Missing YOUR_AGENT_ID");
      return NextResponse.json(
        { error: "YOUR_AGENT_ID not configured" },
        { status: 500 },
      );
    }

    console.log("Making call to Cartesia API with phone:", phone);

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
          target_numbers: [phone],
          agent_id: agentId,
          metadata: {
            companyName,
            contactName,
            email,
          },
        }),
      },
    );

    console.log("Cartesia API response status:", response.status);
    console.log("Cartesia API response ok:", response.ok);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Cartesia API error:", errorData);
      console.error("Cartesia API error status:", response.status);
      return NextResponse.json(
        { error: "Failed to initiate call" },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log(
      "Cartesia API success - full response:",
      JSON.stringify(data, null, 2),
    );

    // Store call information in InstantDB
    try {
      // Extract agent_call_id from the first call in the response
      const agentCallId = data.calls?.[0]?.agent_call_id;
      const callSid = data.calls?.[0]?.call_sid;
      console.log("Cartesia response data:", data);
      console.log("Extracted agent_call_id:", agentCallId);
      console.log("Extracted call_sid:", callSid);

      if (agentCallId) {
        const now = Date.now();
        const taskId = id();
        console.log("Creating task with ID:", taskId);

        await db.transact([
          db.tx.tasks[taskId].update({
            type: "call",
            status: "in_progress",
            priority: "medium",
            fromAddress: "system", // or get from user context
            toAddress: phone,
            subject: `Onboarding call for ${companyName}`,
            content: `Call initiated to ${contactName} at ${phone} for ${companyName}`,
            metadata: JSON.stringify(data), // Store full Cartesia response

            // Call-specific metadata
            agentCallId: agentCallId, // Use agent_call_id as the primary identifier
            callSid: callSid, // Store Twilio call SID separately
            callStatus: "dialing", // Initial status when call is created
            callDirection: "outbound",
            callStartTime: now, // When call was initiated

            startedAt: now,
            createdAt: now,
            updatedAt: now,
          }),
        ]);
        console.log(
          "Task created successfully with ID:",
          taskId,
          "and agent_call_id:",
          agentCallId,
        );
      } else {
        console.log(
          "No agent_call_id found in Cartesia response, skipping task creation",
        );
      }
    } catch (dbError) {
      console.error("Failed to store call in database:", dbError);
      // Don't fail the API call if database storage fails
    }

    return NextResponse.json({
      success: true,
      message: "Call initiated successfully",
      agentCallId: agentCallId,
      taskId: taskId,
      status: "dialing",
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

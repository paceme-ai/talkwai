import { NextResponse } from "next/server";

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

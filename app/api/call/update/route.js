import { id, init } from "@instantdb/admin";
import { NextResponse } from "next/server";

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID,
  adminToken: process.env.INSTANT_ADMIN_TOKEN,
});

export async function POST(request) {
  try {
    const { leads_info, research_info, submission_type } = await request.json();

    // Validate required data
    if (!leads_info && !research_info) {
      return NextResponse.json(
        { error: "Either leads_info or research_info is required" },
        { status: 400 },
      );
    }

    // Generate a unique task ID
    const taskId = id();

    // Prepare task data
    const taskData = {
      type: "call", // This is a call-related task
      status: "completed", // Voice agent completion means the task is done
      priority: leads_info?.interest_level === "high" ? "high" : "medium",
      fromAddress: "voice-agent@system", // System-generated call
      toAddress: leads_info?.domain || "unknown-prospect", // Use domain as identifier
      subject: `Voice Agent Call - ${leads_info?.company || "Unknown Company"}`,
      content: `Voice agent completed call with ${leads_info?.company || "prospect"}`,
      submissionType: submission_type || "voice_agent_completion",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Add leads information if provided
    if (leads_info) {
      taskData.leadsCompany = leads_info.company;
      taskData.leadsDomain = leads_info.domain;
      taskData.leadsAddress = leads_info.address;
      taskData.leadsIndustry = leads_info.industry;
      taskData.leadsHoursOfOperation = leads_info.hours_of_operation;
      taskData.leadsInterestLevel = leads_info.interest_level;
      taskData.leadsPainPoints = JSON.stringify(leads_info.pain_points || []);
      taskData.leadsNextSteps = leads_info.next_steps;
      taskData.leadsNotes = leads_info.notes;
    }

    // Add research information if provided
    if (research_info) {
      taskData.researchCompanyOverview = research_info.company_overview;
      taskData.researchPainPoints = JSON.stringify(research_info.pain_points || []);
      taskData.researchKeyPeople = JSON.stringify(research_info.key_people || []);
      taskData.researchSalesOpportunities = JSON.stringify(research_info.sales_opportunities || []);
    }

    console.log("Creating task with data:", taskData);

    // Insert the task into InstantDB
    await db.transact([
      db.tx.tasks[taskId].update(taskData)
    ]);

    console.log("Task created successfully with ID:", taskId);

    return NextResponse.json({
      success: true,
      taskId: taskId,
      message: "Task created successfully from voice agent completion"
    });

  } catch (error) {
    console.error("Error creating task from voice agent completion:", error);
    return NextResponse.json(
      { 
        error: "Failed to create task", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
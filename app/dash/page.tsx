"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PhoneInput from "@/components/phone-input";
import db from "@/lib/db";

// Create a room for collaboration
// const room = db.room("tenant", "main");

// Industry categories for organization profile
const INDUSTRY_CATEGORIES = [
  "Accounting & Finance",
  "Advertising & Marketing",
  "Agriculture & Farming",
  "Architecture & Design",
  "Automotive",
  "Banking & Financial Services",
  "Beauty & Personal Care",
  "Business Services",
  "Construction & Contracting",
  "Consulting",
  "Dental & Orthodontics",
  "E-commerce & Retail",
  "Education & Training",
  "Engineering",
  "Entertainment & Events",
  "Environmental Services",
  "Fashion & Apparel",
  "Food & Beverage",
  "Government & Public Sector",
  "Healthcare & Medical",
  "Home Services & Maintenance",
  "Hospitality & Tourism",
  "Human Resources",
  "Information Technology",
  "Insurance",
  "Legal Services",
  "Manufacturing",
  "Media & Communications",
  "Non-Profit & Charity",
  "Pet Care & Veterinary",
  "Photography & Videography",
  "Real Estate",
  "Recreation & Fitness",
  "Religious Organizations",
  "Repair & Maintenance",
  "Research & Development",
  "Security Services",
  "Software & Technology",
  "Transportation & Logistics",
  "Travel & Tourism",
  "Utilities & Energy",
  "Wellness & Health",
  "Other",
];

function Dash() {
  const router = useRouter();
  const user = db.useUser();
  // const [showOnboarding, _setShowOnboarding] = useState(true);
  // const [emailVerified, setEmailVerified] = useState(false);
  const [_googleConnected, _setGoogleConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Query member data and tasks
  const {
    isLoading: memberLoading,
    error: memberError,
    data: memberData,
  } = db.useQuery({
    members: {
      $: { where: { email: user?.email } },
      tenant: {},
    },
  });

  const member = memberData?.members?.[0];
  const tenantId = member?.tenant?.id;

  // Query tasks for the tenant
  const {
    isLoading: tasksLoading,
    error: tasksError,
    data: tasksData,
  } = db.useQuery(
    tenantId
      ? {
          tasks: {
            $: {
              where: { "tenant.id": tenantId },
              order: { createdAt: "desc" },
            },
            tenant: {},
            createdBy: {},
            audioFile: {},
          },
        }
      : null,
  );

  useEffect(() => {
    if (user?.email) {
      setEmailVerified(true);
    }
  }, [user]);

  // Handle new users directly on dashboard (no redirect needed)
  useEffect(() => {
    if (!memberLoading && user && !member) {
      console.log("New user detected, will show onboarding on dashboard");
    }
  }, [memberLoading, user, member]);

  if (!user) {
    router.push("/");
    return null;
  }

  // Only wait for tasks if we have a tenant
  const shouldWaitForTasks = tenantId && tasksLoading;

  if (memberLoading || shouldWaitForTasks) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (memberError || tasksError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Error loading dashboard:{" "}
            {memberError?.message || tasksError?.message}
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const tasks = tasksData?.tasks || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sticky Subheader */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 mb-6">
          <div className="flex justify-around">
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "dashboard"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Dashboard icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z"
                />
              </svg>
              <span>Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Settings icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" &&
          (!member ? (
            <OnboardingForm user={user} />
          ) : (
            <>
              <TestCallSection member={member} />
              {/* Tasks Table */}
              <TasksTable tasks={tasks} member={member} />
            </>
          ))}

        {activeTab === "settings" && (
          <ProfileSections member={member} tenant={member?.tenant} />
        )}
      </div>
    </div>
  );
}

// OnboardingForm Component
function OnboardingForm({ user }) {
  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [_agentCallId, setAgentCallId] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create member and tenant records
      const tenantId = crypto.randomUUID();
      const memberId = crypto.randomUUID();

      // Create tenant
      await db.transact(
        db.tx.tenants[tenantId].update({
          name: formData.companyName,
          createdAt: Date.now(),
        }),
      );

      // Detect authentication method
      const urlParams = new URLSearchParams(window.location.search);
      const hasOAuthCode = urlParams.has("code");
      const hasInstantOAuthRedirect = urlParams.has("_instant_oauth_redirect");
      const wasConnectingGoogle = localStorage.getItem("google-connecting");
      const isAlreadyConnected = localStorage.getItem("google-connected");

      const authMethod =
        hasOAuthCode ||
        hasInstantOAuthRedirect ||
        wasConnectingGoogle ||
        isAlreadyConnected
          ? "google"
          : "magic_code";

      // Create member
      await db.transact(
        db.tx.members[memberId]
          .update({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: user.email,
            phone: formData.phone,
            authMethod: authMethod,
            createdAt: Date.now(),
          })
          .link({ tenant: tenantId, user: user.id }),
      );

      // Make the call to Cartesia
      const response = await fetch("/api/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
          companyName: formData.companyName,
          contactName: `${formData.firstName} ${formData.lastName}`,
          email: user.email,
        }),
      });

      const result = await response.json();
      if (result.success && result.agentCallId) {
        setCallId(result.agentCallId);

        // Create initial task for call follow-up
        await db.transact(
          db.tx.tasks[crypto.randomUUID()]
            .update({
              type: "call",
              status: "pending",
              priority: "high",
              fromAddress: "system",
              toAddress: formData.phone,
              subject: "Initial onboarding call completed",
              content: `Call made to ${formData.phone} for ${formData.companyName}`,
              agentCallId: result.agentCallId,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            })
            .link({
              tenant: tenantId,
              assignedTo: memberId,
              createdBy: memberId,
            }),
        );
      }

      // Refresh the page to show the dashboard
      window.location.reload();
    } catch (error) {
      console.error("Error during onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome! Let's get you set up
          </h2>
          <p className="text-gray-600">
            We just need a few details to create your account and make your
            first call
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Company Name *
            </label>
            <input
              id="companyName"
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your company name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="First name"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number *
            </label>
            <PhoneInput
              id="phone"
              value={formData.phone}
              onChange={(value) => handleInputChange("phone", value)}
              className="w-full"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting
                ? "Setting up your account..."
                : "Complete Setup & Make First Call"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ProfileSections Component
function ProfileSections({ member, tenant }) {
  const [orgData, setOrgData] = useState({
    name: tenant?.name || "",
    physicalAddress: tenant?.physicalAddress || "",
    mailingAddress: tenant?.mailingAddress || "",
    mailingAddressSameAsPhysical: tenant?.mailingAddressSameAsPhysical || false,
    legalAddress: tenant?.legalAddress || "",
    legalAddressSameAsPhysical: tenant?.legalAddressSameAsPhysical || false,
    industry: tenant?.industry || "",
    servicesOffered: tenant?.servicesOffered || "",
    serviceAreaType: tenant?.serviceAreaType || "city", // city, zip, radius
    serviceAreaValue: tenant?.serviceAreaValue || "",
    serviceRadius: tenant?.serviceRadius || 25,
    hoursOfOperation: tenant?.hoursOfOperation
      ? JSON.parse(tenant.hoursOfOperation)
      : {
          monday: { open: "09:00", close: "17:00", closed: false },
          tuesday: { open: "09:00", close: "17:00", closed: false },
          wednesday: { open: "09:00", close: "17:00", closed: false },
          thursday: { open: "09:00", close: "17:00", closed: false },
          friday: { open: "09:00", close: "17:00", closed: false },
          saturday: { open: "09:00", close: "17:00", closed: true },
          sunday: { open: "09:00", close: "17:00", closed: true },
        },
    afterHoursHandling: tenant?.afterHoursHandling || "voicemail", // voicemail, forward, emergency
    leadCaptureFields: tenant?.leadCaptureFields
      ? JSON.parse(tenant.leadCaptureFields)
      : ["name", "phone", "email", "service"],
    appointmentSlotLength: tenant?.appointmentSlotLength || 30,
    appointmentBuffer: tenant?.appointmentBuffer || 15,
    calendarIntegration: tenant?.calendarIntegration || "none",
    complianceSettings: tenant?.complianceSettings
      ? JSON.parse(tenant.complianceSettings)
      : {
          callRecordingConsent: false,
          hipaaCompliant: false,
          gdprCompliant: false,
        },
    preferredAreaCodes: tenant?.preferredAreaCodes
      ? JSON.parse(tenant.preferredAreaCodes)
      : [],
    greetingScript: tenant?.greetingScript || "",
  });

  // biome-ignore lint/suspicious/noExplicitAny: just let me have this one
  const handleOrgSave = async (newData: any) => {
    try {
      // Use the tenant ID from the current tenant object
      const tenantId = tenant?.id;
      if (!tenantId) {
        console.error("No tenant ID found");
        return;
      }

      // Remove id and relationship fields to avoid UUID validation errors
      const { _id, _members, _agents, _tasks, ...updateData } = newData;

      // Convert objects to JSON strings for storage
      const processedData = {
        ...updateData,
        hoursOfOperation:
          typeof updateData.hoursOfOperation === "object"
            ? JSON.stringify(updateData.hoursOfOperation)
            : updateData.hoursOfOperation,
        leadCaptureFields: Array.isArray(updateData.leadCaptureFields)
          ? JSON.stringify(updateData.leadCaptureFields)
          : updateData.leadCaptureFields,
        complianceSettings:
          typeof updateData.complianceSettings === "object"
            ? JSON.stringify(updateData.complianceSettings)
            : updateData.complianceSettings,
        preferredAreaCodes: Array.isArray(updateData.preferredAreaCodes)
          ? JSON.stringify(updateData.preferredAreaCodes)
          : updateData.preferredAreaCodes,
      };

      await db.transact(db.tx.tenants[tenantId].update(processedData));
      console.log("Organization updated successfully");
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  // biome-ignore lint/suspicious/noExplicitAny: just let me have this one
  const handleMemberSave = async (newData: any) => {
    try {
      // Use the member ID from the current member object
      const memberId = member?.id;
      if (!memberId) {
        console.error("No member ID found");
        return;
      }

      // Remove id and relationship fields to avoid UUID validation errors
      const {
        _id,
        _tenant,
        _user,
        _assignedTasks,
        _createdTasks,
        ...updateData
      } = newData;

      await db.transact(db.tx.members[memberId].update(updateData));
      console.log("Member updated successfully");
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Organization Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            className="flex items-center space-x-2 cursor-pointer hover:text-blue-600 bg-transparent border-none p-0"
            aria-label="organization profile"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <title>Business icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">
              Organization
            </h3>
          </button>
        </div>

        <div className="space-y-6">
          {/* Organization Name - Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="org-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Organization Name
              </label>
              <input
                id="org-name"
                type="text"
                value={orgData.name}
                onChange={(e) => {
                  const newData = { ...orgData, name: e.target.value };
                  setOrgData(newData);
                  handleOrgSave(newData);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <label
                htmlFor="org-industry"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Industry Category
              </label>
              <select
                id="org-industry"
                value={orgData.industry}
                onChange={(e) => {
                  const newData = { ...orgData, industry: e.target.value };
                  setOrgData(newData);
                  handleOrgSave(newData);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an industry...</option>
                {INDUSTRY_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="services-offered"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Services Offered
              </label>
              <input
                id="services-offered"
                type="text"
                value={orgData.servicesOffered}
                onChange={(e) => {
                  const newData = {
                    ...orgData,
                    servicesOffered: e.target.value,
                  };
                  setOrgData(newData);
                  handleOrgSave(newData);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter services separated by commas"
              />
            </div>
          </div>

          {/* Category, Services, and Service Area - Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="physical-address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Physical Address
              </label>
              <textarea
                id="physical-address"
                value={orgData.physicalAddress}
                onChange={(e) => {
                  const newData = {
                    ...orgData,
                    physicalAddress: e.target.value,
                  };
                  setOrgData(newData);
                  handleOrgSave(newData);
                }}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Street address, city, state, zip"
              />
            </div>
            <div>
              <div className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id="same-mailing"
                  checked={orgData.mailingAddressSameAsPhysical}
                  onChange={(e) => {
                    const newData = {
                      ...orgData,
                      mailingAddressSameAsPhysical: e.target.checked,
                    };
                    setOrgData(newData);
                    handleOrgSave(newData);
                  }}
                  className="mr-2"
                />
                <label
                  htmlFor="mailing-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mailing Address (same as physical)
                </label>
              </div>
              <textarea
                id="mailing-address"
                value={
                  orgData.mailingAddressSameAsPhysical
                    ? orgData.physicalAddress
                    : orgData.mailingAddress
                }
                onChange={(e) => {
                  const newData = {
                    ...orgData,
                    mailingAddress: e.target.value,
                  };
                  setOrgData(newData);
                  handleOrgSave(newData);
                }}
                disabled={orgData.mailingAddressSameAsPhysical}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Street address, city, state, zip"
              />
            </div>
            <div>
              <label
                htmlFor="service-area"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Area
              </label>
              <textarea
                id="service-area"
                value={orgData.serviceAreaValue}
                onChange={(e) => {
                  const newData = {
                    ...orgData,
                    serviceAreaValue: e.target.value,
                  };
                  setOrgData(newData);
                  handleOrgSave(newData);
                }}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cities, zip codes, or radius"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Member Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            className="flex items-center space-x-2 cursor-pointer hover:text-blue-600 bg-transparent border-none p-0"
            aria-label="member profile"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <title>Person icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Member</h3>
          </button>
        </div>

        <div>
          {/* Row 1: First Name, Last Name, Email - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label
                htmlFor="member-firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                id="member-firstName"
                type="text"
                value={member?.firstName || ""}
                onChange={(e) => {
                  const newData = { ...member, firstName: e.target.value };
                  handleMemberSave(newData);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label
                htmlFor="member-lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                id="member-lastName"
                type="text"
                value={member?.lastName || ""}
                onChange={(e) => {
                  const newData = { ...member, lastName: e.target.value };
                  handleMemberSave(newData);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter last name"
              />
            </div>
            <div>
              <label
                htmlFor="member-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="member-email"
                type="email"
                value={member?.email || ""}
                onChange={(e) => {
                  const newData = { ...member, email: e.target.value };
                  handleMemberSave(newData);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Row 2: Role/Title, Notification, Escalation - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="member-title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role/Title
              </label>
              <input
                id="member-title"
                type="text"
                value={member?.title || ""}
                onChange={(e) => {
                  const newData = { ...member, title: e.target.value };
                  handleMemberSave(newData);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter role/title"
              />
            </div>
            <div>
              <label
                htmlFor="member-notification"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notification
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      member?.notificationPreferences
                        ? JSON.parse(member.notificationPreferences).text
                        : false
                    }
                    onChange={(e) => {
                      const currentPrefs = member?.notificationPreferences
                        ? JSON.parse(member.notificationPreferences)
                        : {};
                      const newPrefs = {
                        ...currentPrefs,
                        text: e.target.checked,
                      };
                      const newData = {
                        ...member,
                        notificationPreferences: JSON.stringify(newPrefs),
                      };
                      handleMemberSave(newData);
                    }}
                    className="mr-1"
                  />
                  <span className="text-sm text-gray-700">Text</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      member?.notificationPreferences
                        ? JSON.parse(member.notificationPreferences).email
                        : false
                    }
                    onChange={(e) => {
                      const currentPrefs = member?.notificationPreferences
                        ? JSON.parse(member.notificationPreferences)
                        : {};
                      const newPrefs = {
                        ...currentPrefs,
                        email: e.target.checked,
                      };
                      const newData = {
                        ...member,
                        notificationPreferences: JSON.stringify(newPrefs),
                      };
                      handleMemberSave(newData);
                    }}
                    className="mr-1"
                  />
                  <span className="text-sm text-gray-700">Email</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      member?.notificationPreferences
                        ? JSON.parse(member.notificationPreferences).app
                        : false
                    }
                    onChange={(e) => {
                      const currentPrefs = member?.notificationPreferences
                        ? JSON.parse(member.notificationPreferences)
                        : {};
                      const newPrefs = {
                        ...currentPrefs,
                        app: e.target.checked,
                      };
                      const newData = {
                        ...member,
                        notificationPreferences: JSON.stringify(newPrefs),
                      };
                      handleMemberSave(newData);
                    }}
                    className="mr-1"
                  />
                  <span className="text-sm text-gray-700">App</span>
                </label>
              </div>
            </div>
            <div>
              <label
                htmlFor="member-escalation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Escalation
              </label>
              <textarea
                id="member-escalation"
                value={member?.escalationInstructions || ""}
                onChange={(e) => {
                  const newData = {
                    ...member,
                    escalationInstructions: e.target.value,
                  };
                  handleMemberSave(newData);
                }}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                placeholder="Escalation instructions"
              />
            </div>
          </div>

          {/* Row 3: Phone numbers with types in 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="member-phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone 1
                </label>
                <select
                  value={member?.phoneType || "mobile"}
                  onChange={(e) => {
                    const newData = { ...member, phoneType: e.target.value };
                    handleMemberSave(newData);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-xs max-w-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="mobile">Mobile</option>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="fax">Fax</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <PhoneInput
                id="member-phone"
                value={member?.phone || ""}
                onChange={(value) => {
                  const newData = { ...member, phone: value };
                  handleMemberSave(newData);
                }}
                placeholder="Phone number"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="member-phone2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone 2
                </label>
                <select
                  value={member?.phone2Type || "mobile"}
                  onChange={(e) => {
                    const newData = { ...member, phone2Type: e.target.value };
                    handleMemberSave(newData);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-xs max-w-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="mobile">Mobile</option>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="fax">Fax</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <PhoneInput
                id="member-phone2"
                value={member?.phone2 || ""}
                onChange={(value) => {
                  const newData = { ...member, phone2: value };
                  handleMemberSave(newData);
                }}
                placeholder="Phone number"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="member-phone3"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone 3
                </label>
                <select
                  value={member?.phone3Type || "mobile"}
                  onChange={(e) => {
                    const newData = { ...member, phone3Type: e.target.value };
                    handleMemberSave(newData);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-xs max-w-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="mobile">Mobile</option>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="fax">Fax</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <PhoneInput
                id="member-phone3"
                value={member?.phone3 || ""}
                onChange={(value) => {
                  const newData = { ...member, phone3: value };
                  handleMemberSave(newData);
                }}
                placeholder="Phone number"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// TestCallSection Component
function TestCallSection({ member }) {
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [callResult, setCallResult] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const startTestCall = async () => {
    if (!member?.phone) {
      setCallResult({
        success: false,
        error:
          "No phone number found in your profile. Please add a phone number to test calls.",
      });
      return;
    }

    setIsStartingCall(true);
    setCallResult(null);

    try {
      const response = await fetch("/api/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: member.phone,
          companyName: member.companyName || "Test Company",
          contactName: member.contactName || member.name || "Test Contact",
          email: member.email || "test@example.com",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start call");
      }

      const data = await response.json();
      setCallResult({ success: true, data });
    } catch (error) {
      console.error("Error starting call:", error);
      setCallResult({ success: false, error: error.message });
    } finally {
      setIsStartingCall(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 mb-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <span>📞 Test Call</span>
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Toggle test call details"
            >
              <title>Toggle test call details</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {member?.phone && (
            <span className="text-xs text-gray-500">({member.phone})</span>
          )}
        </div>
        <button
          type="button"
          onClick={startTestCall}
          disabled={isStartingCall || !member?.phone}
          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStartingCall ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-1 h-3 w-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-label="Loading"
              >
                <title>Loading icon</title>
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Starting...
            </>
          ) : (
            "Start Call"
          )}
        </button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 pt-3 border-t border-gray-200"
        >
          <p className="text-sm text-gray-600 mb-3">
            Click the button above to start a test call to your phone number.
            The call will be tracked in the tasks table below, and you'll be
            able to access the recording once it's completed.
          </p>

          {callResult && (
            <div
              className={`p-3 rounded-md ${callResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
            >
              {callResult.success ? (
                <div className="text-sm text-green-800">
                  ✅ Call started successfully! Call ID:{" "}
                  {callResult.data.agent_call_id || callResult.data.id}
                </div>
              ) : (
                <div className="text-sm text-red-800">
                  ❌ Failed to start call: {callResult.error}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// TasksTable Component
function TasksTable({ tasks, member }) {
  const [loadingRecordings, setLoadingRecordings] = useState({});
  const [recordings, setRecordings] = useState({});
  const [playingAudio, setPlayingAudio] = useState(null);
  const [callInfo, setCallInfo] = useState({});
  const [loadingCallInfo, setLoadingCallInfo] = useState({});
  const [pollingIntervals, setPollingIntervals] = useState({});

  // Fetch call info including transcript
  const fetchCallInfo = async (agentCallId) => {
    if (!agentCallId || callInfo[agentCallId] || loadingCallInfo[agentCallId])
      return;

    setLoadingCallInfo((prev) => ({ ...prev, [agentCallId]: true }));
    try {
      const response = await fetch(`/api/call/${agentCallId}`);
      if (response.ok) {
        const data = await response.json();
        setCallInfo((prev) => ({ ...prev, [agentCallId]: data }));
      }
    } catch (error) {
      console.error("Error fetching call info:", error);
    } finally {
      setLoadingCallInfo((prev) => ({ ...prev, [agentCallId]: false }));
    }
  };

  // Poll call status for in-progress calls
  const pollCallStatus = useCallback(async (agentCallId) => {
    try {
      const response = await fetch(`/api/call/${agentCallId}?withAudio=1`);
      if (response.ok) {
        const data = await response.json();
        setCallInfo((prev) => ({ ...prev, [agentCallId]: data }));

        // Note: polling cleanup is handled by the useEffect based on task status changes
      }
    } catch (error) {
      console.error("Error polling call status:", error);
    }
  }, []);

  // Start polling for a call
  const startPolling = useCallback(
    (agentCallId) => {
      if (pollingIntervals[agentCallId]) return; // Already polling

      const intervalId = setInterval(() => {
        pollCallStatus(agentCallId);
      }, 8000); // Poll every 8 seconds

      setPollingIntervals((prev) => ({ ...prev, [agentCallId]: intervalId }));
    },
    [pollingIntervals, pollCallStatus],
  );

  // Stop polling for a call
  const stopPolling = useCallback(
    (agentCallId) => {
      if (pollingIntervals[agentCallId]) {
        clearInterval(pollingIntervals[agentCallId]);
        setPollingIntervals((prev) => {
          const newIntervals = { ...prev };
          delete newIntervals[agentCallId];
          return newIntervals;
        });
      }
    },
    [pollingIntervals],
  );

  // Effect to manage polling for in-progress calls
  useEffect(() => {
    const inProgressCalls = tasks.filter(
      (task) =>
        task.type === "call" &&
        task.status === "in_progress" &&
        task.agentCallId,
    );

    // Start polling for new in-progress calls
    inProgressCalls.forEach((task) => {
      if (!pollingIntervals[task.agentCallId]) {
        startPolling(task.agentCallId);
      }
    });

    // Stop polling for calls that are no longer in progress
    Object.keys(pollingIntervals).forEach((agentCallId) => {
      const stillInProgress = inProgressCalls.some(
        (task) => task.agentCallId === agentCallId,
      );
      if (!stillInProgress) {
        stopPolling(agentCallId);
      }
    });

    // Cleanup on unmount
    return () => {
      Object.values(pollingIntervals).forEach((intervalId) => {
        if (typeof intervalId === "number") {
          clearInterval(intervalId);
        }
      });
    };
  }, [tasks, pollingIntervals, startPolling, stopPolling]);

  const currentCall = tasks.find(
    (task) => task.type === "call" && task.status === "in_progress",
  );
  const otherTasks = tasks.filter(
    (task) => !(task.type === "call" && task.status === "in_progress"),
  );

  const fetchRecording = async (agentCallId) => {
    if (loadingRecordings[agentCallId] || recordings[agentCallId]) return;

    setLoadingRecordings((prev) => ({ ...prev, [agentCallId]: true }));

    try {
      const response = await fetch(`/api/call/${agentCallId}/audio`);
      if (!response.ok) throw new Error("Failed to fetch recording");

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      setRecordings((prev) => ({ ...prev, [agentCallId]: audioUrl }));
    } catch (error) {
      console.error("Error fetching recording:", error);
    } finally {
      setLoadingRecordings((prev) => ({ ...prev, [agentCallId]: false }));
    }
  };

  const playRecording = (agentCallId) => {
    if (playingAudio) {
      playingAudio.pause();
      setPlayingAudio(null);
    }

    if (recordings[agentCallId]) {
      const audio = new Audio(recordings[agentCallId]);
      audio.play();
      setPlayingAudio(audio);

      audio.onended = () => setPlayingAudio(null);
    }
  };

  const stopRecording = () => {
    if (playingAudio) {
      playingAudio.pause();
      setPlayingAudio(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "call":
        return "bg-green-100 text-green-800 border-green-200";
      case "meeting":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "task":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="overflow-x-auto">
        {tasks.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transcript
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recording
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentCall && (
                <motion.tr
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse shadow-lg"></div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          Current Call -{" "}
                          {member?.tenant?.name || "Organization"}
                        </div>
                        <div className="text-sm text-gray-600">
                          Active call in progress
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor("call")}`}
                    >
                      📞 Call
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor("in_progress")}`}
                    >
                      🔄 In Progress
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="text-xs text-gray-500">
                      In progress...
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="text-xs text-gray-500">Recording...</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(currentCall.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500">
                      Call in progress
                    </span>
                  </td>
                </motion.tr>
              )}
              {otherTasks.map((task, index) => (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {task.subject ||
                          task.title ||
                          task.description ||
                          "Untitled Task"}
                      </div>
                      {task.content && (
                        <div className="text-sm text-gray-500 mt-1">
                          {task.content}
                        </div>
                      )}
                      {task.toAddress && (
                        <div className="text-xs text-gray-400 mt-1">
                          To: {task.toAddress}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(task.type || "task")}`}
                    >
                      {task.type === "meeting"
                        ? "📅"
                        : task.type === "call"
                          ? "📞"
                          : "📋"}{" "}
                      {task.type || "Task"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status || "pending")}`}
                    >
                      {task.status === "completed"
                        ? "✅"
                        : task.status === "in_progress"
                          ? "🔄"
                          : task.status === "failed"
                            ? "❌"
                            : "⏳"}{" "}
                      {(task.status || "pending").replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {task.transcriptJson ? (
                      <div className="max-w-xs">
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              const transcript = JSON.parse(
                                task.transcriptJson,
                              );
                              const transcriptText = transcript
                                .map((entry) => `${entry.role}: ${entry.text}`)
                                .join("\n");
                              alert(transcriptText);
                            } catch (_e) {
                              alert(
                                task.callTranscript ||
                                  "No transcript available",
                              );
                            }
                          }}
                          className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                        >
                          📝 View Transcript
                        </button>
                      </div>
                    ) : task.callTranscript ? (
                      <div className="max-w-xs">
                        <button
                          type="button"
                          onClick={() => alert(task.callTranscript)}
                          className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                        >
                          📄 View Text
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        No transcript
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {task.audioFile ? (
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => fetchRecording(task.agentCallId)}
                          disabled={loadingRecordings[task.agentCallId]}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
                        >
                          {loadingRecordings[task.agentCallId] ? "⏳" : "🎵"}{" "}
                          Audio
                        </button>
                        {recordings[task.agentCallId] && (
                          <button
                            type="button"
                            onClick={() => playRecording(task.agentCallId)}
                            className="text-xs bg-blue-100 text-blue-800 px-1 py-1 rounded hover:bg-blue-200 transition-colors"
                          >
                            ▶️
                          </button>
                        )}
                      </div>
                    ) : task.agentCallId ? (
                      <span className="text-xs text-yellow-600">
                        Processing...
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">No audio</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(task.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    {task.type === "call" && task.status === "completed" && (
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => fetchRecording(task.agentCallId)}
                            disabled={loadingRecordings[task.agentCallId]}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {loadingRecordings[task.agentCallId]
                              ? "Loading..."
                              : "Load Recording"}
                          </button>
                          <button
                            type="button"
                            onClick={() => fetchCallInfo(task.agentCallId)}
                            disabled={loadingCallInfo[task.agentCallId]}
                            className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 disabled:opacity-50"
                          >
                            {loadingCallInfo[task.agentCallId]
                              ? "Loading..."
                              : "View Details"}
                          </button>
                        </div>
                        {recordings[task.agentCallId] && (
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => playRecording(task.agentCallId)}
                              className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                            >
                              ▶ Play
                            </button>
                            <button
                              type="button"
                              onClick={stopRecording}
                              className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                            >
                              ⏹ Stop
                            </button>
                          </div>
                        )}
                        {callInfo[task.agentCallId] && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            <div className="font-medium text-gray-700 mb-1">
                              Call Details:
                            </div>
                            {callInfo[task.agentCallId].transcript && (
                              <div>
                                <span className="font-medium">Transcript:</span>
                                <div className="mt-1 text-gray-600 max-w-xs truncate">
                                  {callInfo[task.agentCallId].transcript}
                                </div>
                              </div>
                            )}
                            {callInfo[task.agentCallId].duration && (
                              <div className="mt-1">
                                <span className="font-medium">Duration:</span>{" "}
                                {callInfo[task.agentCallId].duration}s
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500"
            >
              <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-full h-full"
                  aria-label="Empty state"
                >
                  <title>Empty State</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tasks yet
              </h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                Your tasks will appear here as you create them. Start by making
                a call or creating your first task.
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Wrap the dashboard in authentication
function AuthenticatedDash() {
  return (
    <>
      <db.SignedIn>
        <Dash />
      </db.SignedIn>
      <db.SignedOut>
        <RedirectToLogin />
      </db.SignedOut>
    </>
  );
}

// Component to redirect unauthenticated users to login
function RedirectToLogin() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
}

export default AuthenticatedDash;

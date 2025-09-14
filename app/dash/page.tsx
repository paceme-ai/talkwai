"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PhoneInput from "@/components/phone-input";
import db from "@/lib/db";

// Create a room for collaboration
const room = db.room("tenant", "main");

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
  const [showOnboarding, _setShowOnboarding] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [_googleConnected, _setGoogleConnected] = useState(false);

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
          },
        }
      : null,
  );

  useEffect(() => {
    if (user?.email) {
      setEmailVerified(true);
    }
  }, [user]);

  if (!user) {
    router.push("/");
    return null;
  }

  if (memberLoading || tasksLoading) {
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  {member?.tenant?.name || "Your Organization"}
                </p>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <OnlineUsers />
              </div>
            </div>
          </motion.div>

          {/* Email Verification Banner */}
          {!emailVerified && <EmailVerificationBanner />}

          {/* Onboarding Banner */}
          {showOnboarding && <OnboardingBanner member={member} />}

          {/* Profile Sections */}
          <ProfileSections member={member} tenant={member?.tenant} />
          <TestCallSection member={member} />
          {/* Tasks Table */}
          <TasksTable tasks={tasks} member={member} />
        </div>
      </div>
    </>
  );
}

// OnlineUsers Component
function OnlineUsers() {
  const { peers } = db.rooms.usePresence(room);
  const numUsers = 1 + Object.keys(peers).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm"
    >
      <div className="relative">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
      </div>
      <span className="text-sm font-medium text-gray-700">
        {numUsers} {numUsers === 1 ? "user" : "users"} online
      </span>
    </motion.div>
  );
}

// EmailVerificationBanner Component
function EmailVerificationBanner() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const user = db.useUser();

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;

    setIsLoading(true);
    setMessage("");

    try {
      // TODO: Implement email verification with the code
      // This would typically call an API endpoint to verify the code
      console.log("Verifying code:", verificationCode);
      setMessage("Verification successful!");
    } catch (_error) {
      setMessage("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      // TODO: Implement resend verification code
      // This would typically call an API endpoint to resend the code
      console.log("Resending verification code to:", user?.email);
      setMessage("Verification code sent to your email!");
    } catch (_error) {
      setMessage("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-label="Warning icon"
          >
            <title>Warning icon</title>
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Please verify your email address
          </h3>
          <p className="mt-1 text-sm text-yellow-700">
            We sent a verification code to {user?.email}. Enter it below to
            complete your account setup.
          </p>

          <form
            onSubmit={handleVerifyCode}
            className="mt-4 flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading || !verificationCode.trim()}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Resend"}
              </button>
            </div>
          </form>

          {message && (
            <p
              className={`mt-2 text-sm ${
                message.includes("successful") || message.includes("sent")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// OnboardingBanner Component
function OnboardingBanner({ member }) {
  const [isVisible, setIsVisible] = useState(true);
  // Email is already verified when users reach the dashboard from loading screen
  const [completedTasks, setCompletedTasks] = useState(["verify-email"]);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const user = db.useUser();

  // Check if Google is connected and mark task as completed
  useEffect(() => {
    if (user?.email && !completedTasks.includes("connect-google")) {
      // Check multiple indicators that user came through Google OAuth
      const urlParams = new URLSearchParams(window.location.search);
      const hasOAuthCode = urlParams.has("code");
      const hasInstantOAuthRedirect = urlParams.has("_instant_oauth_redirect");
      const wasConnectingGoogle = localStorage.getItem("google-connecting");
      const isAlreadyConnected = localStorage.getItem("google-connected");

      // If any of these conditions are met, mark Google as connected
      if (
        hasOAuthCode ||
        hasInstantOAuthRedirect ||
        wasConnectingGoogle ||
        isAlreadyConnected
      ) {
        setCompletedTasks((prev) => [...prev, "connect-google"]);
        localStorage.setItem("google-connected", "true");
        localStorage.removeItem("google-connecting");

        // Clean up URL parameters to avoid confusion
        if (hasOAuthCode || hasInstantOAuthRedirect) {
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      }
    }
  }, [user, completedTasks]);

  if (!isVisible) return null;

  const handleVerifyEmail = () => {
    // Mark email verification as completed for demo purposes
    // In a real app, this would trigger the magic code flow
    setCompletedTasks((prev) => [...prev, "verify-email"]);
  };

  // Determine redirect URL based on environment
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");
  const googleRedirectURL = isLocalhost
    ? `http://localhost:${typeof window !== "undefined" ? window.location.port || "3000" : "3000"}/dash`
    : `${typeof window !== "undefined" ? window.location.origin : ""}/dash`;

  const googleAuthURL = db.auth.createAuthorizationURL({
    clientName: "google-web",
    redirectURL: googleRedirectURL,
  });

  const tasks = [
    {
      id: "verify-email",
      label: "Verify your email address",
      completed:
        member?.emailVerified || completedTasks.includes("verify-email"),
      action: handleVerifyEmail,
      buttonText: "Verify",
      type: "button",
    },
    {
      id: "connect-google",
      label: "Connect your Google account",
      completed: completedTasks.includes("connect-google"),
      url: googleAuthURL,
      buttonText: isConnectingGoogle ? "Connecting..." : "Connect",
      type: "link",
    },
  ];

  const allCompleted = tasks.every((task) => task.completed);

  if (allCompleted) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        onAnimationComplete={() => setIsVisible(false)}
        className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
      >
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <title>Checkmark icon</title>
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-green-800">
            Setup complete! Welcome to your dashboard.
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Complete your setup
          </h3>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      task.completed
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {task.completed && (
                      <svg
                        className="w-2 h-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-label="Completed"
                      >
                        <title>Completed</title>
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      task.completed
                        ? "text-gray-500 line-through"
                        : "text-blue-800"
                    }`}
                  >
                    {task.label}
                  </span>
                </div>
                {!task.completed &&
                  (task.type === "link" ? (
                    <Link
                      href={task.url}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 inline-block text-center"
                      onClick={() => {
                        if (task.id === "connect-google") {
                          setIsConnectingGoogle(true);
                          localStorage.setItem("google-connecting", "true");
                        }
                      }}
                    >
                      {task.buttonText}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={task.action}
                      disabled={
                        task.id === "connect-google" && isConnectingGoogle
                      }
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {task.buttonText}
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="text-blue-400 hover:text-blue-600 ml-4"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-label="Close"
          >
            <title>Close icon</title>
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

// ProfileSections Component
function ProfileSections({ member, tenant }) {
  const [editingOrg, setEditingOrg] = useState(false);
  const [editingMember, setEditingMember] = useState(false);
  const [showOrgProfile, setShowOrgProfile] = useState(true);
  const [showMemberProfile, setShowMemberProfile] = useState(true);
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
  const [memberData, setMemberData] = useState({
    firstName: member?.firstName || "",
    lastName: member?.lastName || "",
    email: member?.email || "",
    phone: member?.phone || "",
    phoneType: member?.phoneType || "Mobile",
    title: member?.title || "",
    phone2: member?.phone2 || "",
    phone2Type: member?.phone2Type || "Mobile",
    phone3: member?.phone3 || "",
    phone3Type: member?.phone3Type || "Mobile",
    notificationPreferences: member?.notificationPreferences
      ? JSON.parse(member.notificationPreferences)
      : {
          text: true,
          email: true,
          app: true,
        },
    escalationInstructions: member?.escalationInstructions || "",
  });

  const handleOrgSave = async () => {
    try {
      await db.transact(
        db.tx.tenants[tenant.id].update({
          name: orgData.name,
          physicalAddress: orgData.physicalAddress,
          mailingAddress: orgData.mailingAddress,
          mailingAddressSameAsPhysical: orgData.mailingAddressSameAsPhysical,
          legalAddress: orgData.legalAddress,
          legalAddressSameAsPhysical: orgData.legalAddressSameAsPhysical,
          industry: orgData.industry,
          servicesOffered: orgData.servicesOffered,
          serviceAreaType: orgData.serviceAreaType,
          serviceAreaValue: orgData.serviceAreaValue,
          serviceRadius: orgData.serviceRadius,
          hoursOfOperation: JSON.stringify(orgData.hoursOfOperation),
          afterHoursHandling: orgData.afterHoursHandling,
          leadCaptureFields: JSON.stringify(orgData.leadCaptureFields),
          appointmentSlotLength: orgData.appointmentSlotLength,
          appointmentBuffer: orgData.appointmentBuffer,
          calendarIntegration: orgData.calendarIntegration,
          complianceSettings: JSON.stringify(orgData.complianceSettings),
          preferredAreaCodes: JSON.stringify(orgData.preferredAreaCodes),
          greetingScript: orgData.greetingScript,
        }),
      );
      setEditingOrg(false);
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  const handleMemberSave = async () => {
    try {
      await db.transact(
        db.tx.members[member.id].update({
          firstName: memberData.firstName,
          lastName: memberData.lastName,
          email: memberData.email,
          phone: memberData.phone,
          phoneType: memberData.phoneType,
          title: memberData.title,
          phone2: memberData.phone2,
          phone2Type: memberData.phone2Type,
          phone3: memberData.phone3,
          phone3Type: memberData.phone3Type,
          notificationPreferences: JSON.stringify(
            memberData.notificationPreferences,
          ),
          escalationInstructions: memberData.escalationInstructions,
        }),
      );
      setEditingMember(false);
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  const handleOrgCancel = () => {
    setOrgData({
      name: tenant?.name || "",
      physicalAddress: tenant?.physicalAddress || "",
      mailingAddress: tenant?.mailingAddress || "",
      mailingAddressSameAsPhysical:
        tenant?.mailingAddressSameAsPhysical || false,
      legalAddress: tenant?.legalAddress || "",
      legalAddressSameAsPhysical: tenant?.legalAddressSameAsPhysical || false,
      industry: tenant?.industry || "",
      servicesOffered: tenant?.servicesOffered || "",
      serviceAreaType: tenant?.serviceAreaType || "city",
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
      afterHoursHandling: tenant?.afterHoursHandling || "voicemail",
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
    setEditingOrg(false);
  };

  const handleMemberCancel = () => {
    setMemberData({
      firstName: member?.firstName || "",
      lastName: member?.lastName || "",
      email: member?.email || "",
      phone: member?.phone || "",
      phoneType: member?.phoneType || "Mobile",
      title: member?.title || "",
      phone2: member?.phone2 || "",
      phone2Type: member?.phone2Type || "Mobile",
      phone3: member?.phone3 || "",
      phone3Type: member?.phone3Type || "Mobile",
      notificationPreferences: member?.notificationPreferences
        ? JSON.parse(member.notificationPreferences)
        : {
            text: true,
            email: true,
            app: true,
          },
      escalationInstructions: member?.escalationInstructions || "",
    });
    setEditingMember(false);
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
            onClick={() => setShowOrgProfile(!showOrgProfile)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowOrgProfile(!showOrgProfile);
              }
            }}
            aria-label={`${showOrgProfile ? 'Collapse' : 'Expand'} organization profile`}
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
              {tenant?.name || "Organization"}
            </h3>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${showOrgProfile ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <title>Expand/collapse arrow</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          {!editingOrg ? (
            <button
              type="button"
              onClick={() => setEditingOrg(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Edit organization"
              >
                <title>Edit organization</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleOrgSave}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleOrgCancel}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {showOrgProfile && (
        <div className="space-y-6">
          {/* Basic Information - Row 1: 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="org-industry"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Industry Category
              </label>
              {editingOrg ? (
                <select
                  id="org-industry"
                  value={orgData.industry}
                  onChange={(e) =>
                    setOrgData({ ...orgData, industry: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an industry...</option>
                  {INDUSTRY_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900">{tenant?.industry || "Not set"}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="services-offered"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Services Offered
              </label>
              {editingOrg ? (
                <input
                  id="services-offered"
                  type="text"
                  value={orgData.servicesOffered}
                  onChange={(e) =>
                    setOrgData({
                      ...orgData,
                      servicesOffered: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter services separated by commas"
                />
              ) : (
                <p className="text-gray-900">
                  {tenant?.servicesOffered || "Not set"}
                </p>
              )}
            </div>
            <div className="">
              <label
                htmlFor="service-area"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Area
              </label>
              {editingOrg ? (
                <textarea
                  id="service-area"
                  value={orgData.serviceAreaValue}
                  onChange={(e) =>
                    setOrgData({
                      ...orgData,
                      serviceAreaValue: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cities, zip codes, or radius"
                />
              ) : (
                <p className="text-gray-900">
                  {tenant?.serviceAreaValue || "Not set"}
                </p>
              )}
            </div>
          </div>

          {/* Business Addresses */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="physical-address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Physical Address
                  </label>
                  {editingOrg ? (
                    <textarea
                      id="physical-address"
                      value={orgData.physicalAddress}
                      onChange={(e) =>
                        setOrgData({
                          ...orgData,
                          physicalAddress: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Street address, city, state, zip"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {tenant?.physicalAddress || "Not set"}
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    {editingOrg && (
                      <input
                        type="checkbox"
                        id="same-mailing"
                        checked={orgData.mailingAddressSameAsPhysical}
                        onChange={(e) =>
                          setOrgData({
                            ...orgData,
                            mailingAddressSameAsPhysical: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                    )}
                    <label
                      htmlFor="mailing-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mailing Address {editingOrg && "(same as physical)"}
                    </label>
                  </div>
                  {editingOrg ? (
                    <textarea
                      id="mailing-address"
                      value={
                        orgData.mailingAddressSameAsPhysical
                          ? orgData.physicalAddress
                          : orgData.mailingAddress
                      }
                      onChange={(e) =>
                        setOrgData({
                          ...orgData,
                          mailingAddress: e.target.value,
                        })
                      }
                      disabled={orgData.mailingAddressSameAsPhysical}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      placeholder="Street address, city, state, zip"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {tenant?.mailingAddress ||
                        tenant?.physicalAddress ||
                        "Not set"}
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    {editingOrg && (
                      <input
                        type="checkbox"
                        id="same-legal"
                        checked={orgData.legalAddressSameAsPhysical}
                        onChange={(e) =>
                          setOrgData({
                            ...orgData,
                            legalAddressSameAsPhysical: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                    )}
                    <label
                      htmlFor="legal-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Legal Address {editingOrg && "(same as physical)"}
                    </label>
                  </div>
                  {editingOrg ? (
                    <textarea
                      id="legal-address"
                      value={
                        orgData.legalAddressSameAsPhysical
                          ? orgData.physicalAddress
                          : orgData.legalAddress
                      }
                      onChange={(e) =>
                        setOrgData({ ...orgData, legalAddress: e.target.value })
                      }
                      disabled={orgData.legalAddressSameAsPhysical}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      placeholder="Street address, city, state, zip"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {tenant?.legalAddress ||
                        tenant?.physicalAddress ||
                        "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
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
            onClick={() => setShowMemberProfile(!showMemberProfile)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowMemberProfile(!showMemberProfile);
              }
            }}
            aria-label={`${showMemberProfile ? 'Collapse' : 'Expand'} member profile`}
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
            <h3 className="text-lg font-semibold text-gray-900">
              {member?.firstName && member?.lastName 
                ? `${member.firstName} ${member.lastName}` 
                : "Member"}
            </h3>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${showMemberProfile ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <title>Expand/collapse arrow</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          {!editingMember ? (
            <button
              type="button"
              onClick={() => setEditingMember(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Edit member"
              >
                <title>Edit member</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleMemberSave}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleMemberCancel}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {showMemberProfile && (
        <div>
        {/* Row 1: 4 columns - Role/Title, Email, Notification, Escalation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="member-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role/Title
            </label>
            {editingMember ? (
              <input
                id="member-title"
                type="text"
                value={memberData.title}
                onChange={(e) =>
                  setMemberData({ ...memberData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter role/title"
              />
            ) : (
              <p className="text-gray-900">{member?.title || "Not set"}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="member-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            {editingMember ? (
              <input
                id="member-email"
                type="email"
                value={memberData.email}
                onChange={(e) =>
                  setMemberData({ ...memberData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{member?.email || "Not set"}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="member-notification"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notification
            </label>
            {editingMember ? (
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={memberData.notificationPreferences.text}
                    onChange={(e) =>
                      setMemberData({
                        ...memberData,
                        notificationPreferences: {
                          ...memberData.notificationPreferences,
                          text: e.target.checked,
                        },
                      })
                    }
                    className="mr-1"
                  />
                  <span className="text-sm text-gray-700">Text</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={memberData.notificationPreferences.email}
                    onChange={(e) =>
                      setMemberData({
                        ...memberData,
                        notificationPreferences: {
                          ...memberData.notificationPreferences,
                          email: e.target.checked,
                        },
                      })
                    }
                    className="mr-1"
                  />
                  <span className="text-sm text-gray-700">Email</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={memberData.notificationPreferences.app}
                    onChange={(e) =>
                      setMemberData({
                        ...memberData,
                        notificationPreferences: {
                          ...memberData.notificationPreferences,
                          app: e.target.checked,
                        },
                      })
                    }
                    className="mr-1"
                  />
                  <span className="text-sm text-gray-700">App</span>
                </label>
              </div>
            ) : (
              <div className="flex space-x-1 flex-wrap">
                {member?.notificationPreferences ? (
                  Object.entries(JSON.parse(member.notificationPreferences))
                    .filter(([_, enabled]) => enabled)
                    .map(([type, _]) => (
                      <span
                        key={type}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    ))
                ) : (
                  <span className="text-gray-900 text-xs">Not set</span>
                )}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="member-escalation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Escalation
            </label>
            {editingMember ? (
              <textarea
                id="member-escalation"
                value={memberData.escalationInstructions}
                onChange={(e) =>
                  setMemberData({
                    ...memberData,
                    escalationInstructions: e.target.value,
                  })
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                placeholder="Escalation instructions"
              />
            ) : (
              <p className="text-gray-900 text-xs">
                {member?.escalationInstructions || "Not set"}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Phone numbers with types in 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="member-phone"
                className="block text-sm font-medium text-gray-700"
              >
                {editingMember ? "Phone 1" : `Phone 1 (${member?.phoneType || "mobile"})`}
              </label>
              {editingMember && (
                <select
                  value={memberData.phoneType}
                  onChange={(e) =>
                    setMemberData({ ...memberData, phoneType: e.target.value })
                  }
                  className="px-2 py-1 border border-gray-300 rounded text-xs max-w-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="mobile">Mobile</option>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="fax">Fax</option>
                  <option value="other">Other</option>
                </select>
              )}
            </div>
            {editingMember ? (
              <PhoneInput
                id="member-phone"
                value={memberData.phone}
                onChange={(value) =>
                  setMemberData({ ...memberData, phone: value })
                }
                placeholder="Phone number"
              />
            ) : (
              <p className="text-gray-900">{member?.phone || "Not set"}</p>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="member-phone2"
                className="block text-sm font-medium text-gray-700"
              >
                {editingMember ? "Phone 2" : `Phone 2 (${member?.phone2Type || "mobile"})`}
              </label>
              {editingMember && (
                <select
                  value={memberData.phone2Type}
                  onChange={(e) =>
                    setMemberData({ ...memberData, phone2Type: e.target.value })
                  }
                  className="px-2 py-1 border border-gray-300 rounded text-xs max-w-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="mobile">Mobile</option>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="fax">Fax</option>
                  <option value="other">Other</option>
                </select>
              )}
            </div>
            {editingMember ? (
              <PhoneInput
                id="member-phone2"
                value={memberData.phone2}
                onChange={(value) =>
                  setMemberData({
                    ...memberData,
                    phone2: value,
                  })
                }
                placeholder="Phone number"
              />
            ) : (
              <p className="text-gray-900">{member?.phone2 || "Not set"}</p>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="member-phone3"
                className="block text-sm font-medium text-gray-700"
              >
                {editingMember ? "Phone 3" : `Phone 3 (${member?.phone3Type || "mobile"})`}
              </label>
              {editingMember && (
                <select
                  value={memberData.phone3Type}
                  onChange={(e) =>
                    setMemberData({ ...memberData, phone3Type: e.target.value })
                  }
                  className="px-2 py-1 border border-gray-300 rounded text-xs max-w-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="mobile">Mobile</option>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="fax">Fax</option>
                  <option value="other">Other</option>
                </select>
              )}
            </div>
            {editingMember ? (
              <PhoneInput
                id="member-phone3"
                value={memberData.phone3}
                onChange={(value) =>
                  setMemberData({
                    ...memberData,
                    phone3: value,
                  })
                }
                placeholder="Phone number"
              />
            ) : (
              <p className="text-gray-900">{member?.phone3 || "Not set"}</p>
            )}
          </div>
        </div>
        </div>
        )}
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
          phoneNumber: member.phone,
          message: "This is a test call from the dashboard.",
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
                  {callResult.data.call_id || callResult.data.id}
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

  // Fetch call info including transcript
  const fetchCallInfo = async (callId) => {
    if (!callId || callInfo[callId] || loadingCallInfo[callId]) return;

    setLoadingCallInfo((prev) => ({ ...prev, [callId]: true }));
    try {
      const response = await fetch(`/api/call/${callId}`);
      if (response.ok) {
        const data = await response.json();
        setCallInfo((prev) => ({ ...prev, [callId]: data }));
      }
    } catch (error) {
      console.error("Error fetching call info:", error);
    } finally {
      setLoadingCallInfo((prev) => ({ ...prev, [callId]: false }));
    }
  };

  const currentCall = tasks.find(
    (task) => task.type === "call" && task.status === "in_progress",
  );
  const otherTasks = tasks.filter(
    (task) => !(task.type === "call" && task.status === "in_progress"),
  );

  const fetchRecording = async (callId) => {
    if (loadingRecordings[callId] || recordings[callId]) return;

    setLoadingRecordings((prev) => ({ ...prev, [callId]: true }));

    try {
      const response = await fetch(`/api/call/${callId}/audio`);
      if (!response.ok) throw new Error("Failed to fetch recording");

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      setRecordings((prev) => ({ ...prev, [callId]: audioUrl }));
    } catch (error) {
      console.error("Error fetching recording:", error);
    } finally {
      setLoadingRecordings((prev) => ({ ...prev, [callId]: false }));
    }
  };

  const playRecording = (callId) => {
    if (playingAudio) {
      playingAudio.pause();
      setPlayingAudio(null);
    }

    if (recordings[callId]) {
      const audio = new Audio(recordings[callId]);
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
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track your ongoing activities and completed work
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </div>
            {currentCall && (
              <div className="flex items-center space-x-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Live</span>
              </div>
            )}
          </div>
        </div>
      </div>

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
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(task.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    {task.type === "call" && task.status === "completed" && (
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => fetchRecording(task.callId)}
                            disabled={loadingRecordings[task.callId]}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {loadingRecordings[task.callId]
                              ? "Loading..."
                              : "Load Recording"}
                          </button>
                          <button
                            type="button"
                            onClick={() => fetchCallInfo(task.callId)}
                            disabled={loadingCallInfo[task.callId]}
                            className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 disabled:opacity-50"
                          >
                            {loadingCallInfo[task.callId]
                              ? "Loading..."
                              : "View Details"}
                          </button>
                        </div>
                        {recordings[task.callId] && (
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => playRecording(task.callId)}
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
                        {callInfo[task.callId] && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            <div className="font-medium text-gray-700 mb-1">
                              Call Details:
                            </div>
                            {callInfo[task.callId].transcript && (
                              <div>
                                <span className="font-medium">Transcript:</span>
                                <div className="mt-1 text-gray-600 max-w-xs truncate">
                                  {callInfo[task.callId].transcript}
                                </div>
                              </div>
                            )}
                            {callInfo[task.callId].duration && (
                              <div className="mt-1">
                                <span className="font-medium">Duration:</span>{" "}
                                {callInfo[task.callId].duration}s
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

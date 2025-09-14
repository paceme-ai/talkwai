"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import db from "@/lib/db";
import AuthenticatedHeader from "@/components/authenticated-header";

// Create a room for collaboration
const room = db.room("tenant", "main");

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
      <AuthenticatedHeader />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back{member?.firstName ? `, ${member.firstName}` : ""}!
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                {member?.tenant?.name || "Your Organization"} Dashboard
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

        {/* Tasks Table */}
        <TestCallSection />
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
    } catch (error) {
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
    } catch (error) {
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
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-label="Warning icon">
             <title>Warning icon</title>
             <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
           </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Please verify your email address
          </h3>
          <p className="mt-1 text-sm text-yellow-700">
            We sent a verification code to {user?.email}. Enter it below to complete your account setup.
          </p>
          
          <form onSubmit={handleVerifyCode} className="mt-4 flex flex-col sm:flex-row gap-3">
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
            <p className={`mt-2 text-sm ${
              message.includes("successful") || message.includes("sent") 
                ? "text-green-600" 
                : "text-red-600"
            }`}>
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
      const hasOAuthCode = urlParams.has('code');
      const hasInstantOAuthRedirect = urlParams.has('_instant_oauth_redirect');
      const wasConnectingGoogle = localStorage.getItem('google-connecting');
      const isAlreadyConnected = localStorage.getItem('google-connected');
      
      // If any of these conditions are met, mark Google as connected
      if (hasOAuthCode || hasInstantOAuthRedirect || wasConnectingGoogle || isAlreadyConnected) {
        setCompletedTasks(prev => [...prev, "connect-google"]);
        localStorage.setItem('google-connected', 'true');
        localStorage.removeItem('google-connecting');
        
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
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const googleRedirectURL = isLocalhost 
    ? `http://localhost:${typeof window !== 'undefined' ? window.location.port || '3000' : '3000'}/dash`
    : `${typeof window !== 'undefined' ? window.location.origin : ''}/dash`;
  
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
      type: "button"
    },
    {
      id: "connect-google",
      label: "Connect your Google account",
      completed: completedTasks.includes("connect-google"),
      url: googleAuthURL,
      buttonText: isConnectingGoogle ? "Connecting..." : "Connect",
      type: "link"
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
              <title>Checkmark</title>
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
                {!task.completed && (
                  task.type === "link" ? (
                    <Link
                      href={task.url}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 inline-block text-center"
                      onClick={() => {
                        if (task.id === "connect-google") {
                          setIsConnectingGoogle(true);
                          localStorage.setItem('google-connecting', 'true');
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
                  )
                )}
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="text-blue-400 hover:text-blue-600 ml-4"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <title>Close</title>
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

// TestCallSection Component
function TestCallSection() {
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [callResult, setCallResult] = useState(null);

  const startTestCall = async () => {
    setIsStartingCall(true);
    setCallResult(null);
    
    try {
      const response = await fetch('/api/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: '+1234567890', // Test number
          message: 'This is a test call from the dashboard.'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to start call');
      }
      
      const data = await response.json();
      setCallResult({ success: true, data });
    } catch (error) {
      console.error('Error starting call:', error);
      setCallResult({ success: false, error: error.message });
    } finally {
      setIsStartingCall(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Test Call</h3>
        <button
          type="button"
          onClick={startTestCall}
          disabled={isStartingCall}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStartingCall ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <title>Loading</title>
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
              Starting Call...
            </>
          ) : (
            <>
              📞 Start Test Call
            </>
          )}
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Click the button above to start a test call. The call will be tracked in the tasks table below, and you'll be able to access the recording once it's completed.
      </p>
      
      {callResult && (
        <div className={`p-3 rounded-md ${callResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {callResult.success ? (
            <div className="text-sm text-green-800">
              ✅ Call started successfully! Call ID: {callResult.data.call_id || callResult.data.id}
            </div>
          ) : (
            <div className="text-sm text-red-800">
              ❌ Failed to start call: {callResult.error}
            </div>
          )}
        </div>
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
    
    setLoadingCallInfo(prev => ({ ...prev, [callId]: true }));
    try {
      const response = await fetch(`/api/call/${callId}`);
      if (response.ok) {
        const data = await response.json();
        setCallInfo(prev => ({ ...prev, [callId]: data }));
      }
    } catch (error) {
      console.error('Error fetching call info:', error);
    } finally {
      setLoadingCallInfo(prev => ({ ...prev, [callId]: false }));
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
    
    setLoadingRecordings(prev => ({ ...prev, [callId]: true }));
    
    try {
      const response = await fetch(`/api/call/${callId}/audio`);
      if (!response.ok) throw new Error('Failed to fetch recording');
      
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      
      setRecordings(prev => ({ ...prev, [callId]: audioUrl }));
    } catch (error) {
      console.error('Error fetching recording:', error);
    } finally {
      setLoadingRecordings(prev => ({ ...prev, [callId]: false }));
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
                    <span className="text-xs text-gray-500">Call in progress</span>
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
                            {loadingRecordings[task.callId] ? "Loading..." : "Load Recording"}
                          </button>
                          <button
                            type="button"
                            onClick={() => fetchCallInfo(task.callId)}
                            disabled={loadingCallInfo[task.callId]}
                            className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 disabled:opacity-50"
                          >
                            {loadingCallInfo[task.callId] ? "Loading..." : "View Details"}
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
                            <div className="font-medium text-gray-700 mb-1">Call Details:</div>
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
                                <span className="font-medium">Duration:</span> {callInfo[task.callId].duration}s
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
                >
                  <title>Empty state</title>
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

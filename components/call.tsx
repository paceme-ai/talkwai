"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PhoneInput, { formatPhoneForDB } from "@/components/phone-input";
import db, { id } from "@/lib/db";

export default function CallForm({ onRegistrationComplete }) {
  const [tenant, setTenant] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const auth = db.useAuth();
  const user = auth.user;

  // Pre-fill email if user is authenticated
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user?.email, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tenant) {
      setMessage("Please enter your organization");
      return;
    }
    if (!name) {
      setMessage("Please enter your full name");
      return;
    }
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }
    if (!phoneNumber) {
      setMessage("Please enter a phone number");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Create tenant and member in InstantDB
      const tenantId = id();
      const memberId = id();
      const taskId = id();

      // Split name into first and last
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Create tenant
      await db.transact(
        db.tx.tenants[tenantId].update({
          name: tenant,
          status: "active",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
      );

      // Create member and link to tenant
      const formattedPhoneForDB = formatPhoneForDB(phoneNumber);

      // Detect authentication method - if user is already authenticated, they came via Google OAuth
      const authMethod = user ? "google" : "magic_code";

      await db.transact(
        db.tx.members[memberId]
          .update({
            firstName,
            lastName,
            email,
            phone: formattedPhoneForDB,
            role: "owner",
            status: "active",
            authMethod: authMethod,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })
          .link({ tenant: tenantId }),
      );

      // Create initial call task
      await db.transact(
        db.tx.tasks[taskId]
          .update({
            type: "call",
            status: "in_progress",
            priority: "high",
            fromAddress: "TalkwAI",
            toAddress: formattedPhoneForDB,
            subject: "Initial Demo Call",
            content: `Demo call for ${tenant} - ${name}`,
            startedAt: Date.now(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })
          .link({
            tenant: tenantId,
            createdBy: memberId,
          }),
      );

      // Initiate the actual call
      const response = await fetch("/api/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: formattedPhoneForDB }),
      });

      const data = await response.json();

      if (response.ok) {
        const memberData = {
          memberId,
          tenantId,
          email,
          name: `${firstName} ${lastName}`.trim(),
        };

        if (user) {
          // User is already authenticated (Google OAuth), skip magic code
          console.log("User already authenticated, skipping magic code");
          if (onRegistrationComplete) {
            onRegistrationComplete(memberData);
          } else {
            router.push("/dash");
          }
        } else {
          // Send magic code for authentication
          await db.auth.sendMagicCode({ email });

          if (onRegistrationComplete) {
            // If callback provided (register page), call it instead of routing
            onRegistrationComplete(memberData);
          } else {
            // Store member info in localStorage for the loading page
            localStorage.setItem("pendingMember", JSON.stringify(memberData));
            // Route to dashboard page
            router.push("/dash");
          }
        }
      } else {
        setMessage(data.error || "Failed to initiate call");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form
        className="flex flex-wrap gap-3 justify-center"
        onSubmit={handleSubmit}
      >
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Your Organization"
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <PhoneInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder="(555) 123-4567"
            required
            className="py-3 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="min-w-[140px] px-5 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 whitespace-nowrap font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Calling..." : "Talk with AI"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-2 text-sm ${
            message.includes("initiated") ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

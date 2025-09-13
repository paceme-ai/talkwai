"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import db, { id } from "@/lib/db";

// Phone number formatting utilities
const formatPhoneDisplay = (value: string): string => {
  // Remove all non-digits
  let digits = value.replace(/\D/g, '');
  
  // Remove leading '1' if present (since we show +1 as decoration)
  if (digits.startsWith('1')) {
    digits = digits.slice(1);
  }
  
  // Limit to 10 digits max
  digits = digits.slice(0, 10);
  
  // Format based on length
  if (digits.length === 0) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const formatPhoneForDB = (value: string): string => {
  // Remove all non-digits
  let digits = value.replace(/\D/g, '');
  
  // Remove leading '1' if present (since we always add +1 prefix)
  if (digits.startsWith('1')) {
    digits = digits.slice(1);
  }
  
  // Take only the last 10 digits and add +1 prefix
  digits = digits.slice(-10);
  return `+1${digits}`;
};

export default function CallForm() {
  const [tenant, setTenant] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneDisplay(input);
    setPhoneNumber(formatted);
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const formatted = formatPhoneDisplay(pastedText);
    setPhoneNumber(formatted);
  };

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
      await db.transact(
        db.tx.members[memberId]
          .update({
            firstName,
            lastName,
            email,
            phone: formattedPhoneForDB,
            role: "owner",
            status: "active",
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
        // Send magic code for authentication
        await db.auth.sendMagicCode({ email });

        // Store member info in localStorage for the loading page
        localStorage.setItem(
          "pendingMember",
          JSON.stringify({
            memberId,
            tenantId,
            email,
            name: `${firstName} ${lastName}`.trim(),
          }),
        );

        // Route to dashboard page
        router.push("/dash");
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
        <div className="flex-1 min-w-[200px] relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none z-10">
            +1
          </div>
          <input
            type="tel"
            placeholder="(555) 123-4567"
            value={phoneNumber}
            onChange={handlePhoneChange}
            onPaste={handlePhonePaste}
            required
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import db, { id } from "@/lib/db";

export default function CallForm() {
  const [tenant, setTenant] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

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
      await db.transact(
        db.tx.members[memberId]
          .update({
            firstName,
            lastName,
            email,
            phone: phoneNumber,
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
            toAddress: phoneNumber,
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
        body: JSON.stringify({ phoneNumber }),
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

        // Route to loading page
        router.push("/loading");
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
      <form className="flex flex-wrap gap-3 justify-center" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Organization"
          value={tenant}
          onChange={(e) => setTenant(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <input
          type="text"
          placeholder="Your Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <input
          type="email"
          placeholder="Your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <input
          type="tel"
          placeholder="Your Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
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
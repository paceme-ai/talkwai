// app/page.js
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Calculator from "@/components/calc";
import CallForm from "@/components/call";
import AudioPlayer from "@/components/audio-player";
import db, { id } from "@/lib/db";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-6">
      {/* Hero */}
      <section className="py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
          Answer 24/7.{" "}
          <span className="text-emerald-600">
            Stay on top of your business.
          </span>
        </h1>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="mt-4 text-lg text-gray-700">
              TalkwAI helps small businesses handle calls, customers, and chaos
              — so you can focus on the work that matters. Our AI voice agent{" "}
              <strong>TalkwAI</strong> answers, qualifies, and routes every
              call. Never miss a lead again.{" "}
              <strong>Listen to TalkwAI in Action:</strong>
            </p>
            {/* Audio Player */}
            <div className="mt-4 w-full">
              <AudioPlayer
                tracks={[
                  {
                    title: "HVAC Emergency Call",
                    file: "/demo.mp3",
                    duration: 36,
                  },
                  {
                    title: "Appointment Booking",
                    file: "/demo2.mp3",
                    duration: 23,
                  },
                  {
                    title: "Service Inquiry",
                    file: "/demo3.mp3",
                    duration: 18,
                  },
                ]}
              />
            </div>
            <div className="justify-start mt-6 flex flex-col items-start gap-3">
              <p className="text-lg text-gray-700 font-bold">
                Let it speak for itself.
              </p>
              <Link
                href="/register"
                className="px-6 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold"
              >
                Try TalkwAI for free
              </Link>
            </div>
          </div>
          <div>
            <Calculator />
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 border-t">
        <h2 className="text-2xl md:text-3xl font-semibold">
          The hidden cost of missed calls
        </h2>
        <p className="mt-2 text-gray-700">
          Small businesses lose thousands each year from missed calls, slow
          responses, and overwhelm. TalkwAI keeps you steady.
        </p>
        <div className="mt-8 grid sm:grid-cols-3 gap-6">
          <Card
            title="Missed Calls"
            emoji="📞"
            text="Never let leads slip. TalkwAI answers, qualifies, and routes 24/7."
          />
          <Card
            title="Lost Jobs"
            emoji="💸"
            text="Prioritize emergencies and book faster to capture high-value work."
          />
          <Card
            title="Burnout"
            emoji="😓"
            text="Free up your time. Focus on what you do best — we’ll handle the rest."
          />
        </div>
      </section>

      {/* Solution: Meet TalkwAI */}
      <section id="solution" className="py-16 border-t">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Meet <span className="text-emerald-600">TalkwAI</span> — your AI
              receptionist
            </h2>
            <ul className="mt-6 space-y-3 text-gray-700 list-disc pl-5">
              <li>Answers every call with a friendly, professional tone.</li>
              <li>Captures name, number, address, and service need.</li>
              <li>Flags emergencies, routes jobs, and logs transcripts.</li>
              <li>Syncs to your dashboard, CRM, Slack, email, and SMS.</li>
              <li>Customizable script, hours, and escalation rules.</li>
            </ul>
            <div className="mt-6">
              <a
                href="#how"
                className="text-emerald-700 font-medium hover:underline"
              >
                See how it works →
              </a>
            </div>
          </div>
          <div className="rounded-2xl border p-6 bg-gray-50">
            <h3 className="font-semibold text-lg">Why TalkwAI?</h3>
            <p className="mt-2 text-gray-700">
              Because running a small business is already hard enough. We help
              you breathe easier, stay on track, and build sustainably.
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
              <Badge>Never miss a lead</Badge>
              <Badge>Prioritize emergencies</Badge>
              <Badge>Faster booking</Badge>
              <Badge>Real-time transcripts</Badge>
              <Badge>LA & Chicago first</Badge>
              <Badge>HVAC-ready today</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-16 border-t">
        <h2 className="text-2xl md:text-3xl font-semibold">How it works</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Step
            n="1"
            title="Calls go to TalkwAI"
            text="Forward your business line. TalkwAI picks up instantly and follows your script."
          />
          <Step
            n="2"
            title="Qualify & route"
            text="We capture details, flag priority, and send leads to SMS/email/CRM."
          />
          <Step
            n="3"
            title="You book & win"
            text="Your team follows up fast. We track everything in your dashboard."
          />
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-16 border-t">
        <h2 className="text-2xl md:text-3xl font-semibold">Loved by busy teams</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <Quote
            text="We stopped losing emergency calls after hours. TalkwAI paid for itself in week one."
            name="Ramon G."
            quoteRole="Owner, Metro HVAC"
          />
          <Quote
            text="Set up took an afternoon. The transcripts and summaries are gold for training."
            name="Alyssa P."
            quoteRole="Ops Lead, Windy City Heating"
          />
          <Quote
            text="We sound professional every time. Our booking rate jumped immediately."
            name="Derrick L."
            quoteRole="Founder, LA Cool & Heat"
          />
        </div>
      </section> */}



      {/* Final CTA */}
      <section id="get-started" className="py-16 border-t">
        <div className="rounded-2xl border p-8 bg-emerald-50">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Ready to get your time back?
          </h2>
          <p className="mt-2 text-gray-700">
            Spin up TalkwAI in minutes. Forward your line, set your script, and
            stop losing leads.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="px-5 py-3 rounded-xl border hover:bg-gray-50"
            >
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Contact */}
      {/* <section id="contact" className="py-16 border-t">
        <h2 className="text-2xl md:text-3xl font-semibold">Contact</h2>
        <p className="mt-2 text-gray-700">Tell us a bit about your business and we’ll reach out fast.</p>
        <form className="mt-6 grid md:grid-cols-2 gap-4">
          <input className="border rounded-lg px-4 py-3" placeholder="Full name" />
          <input className="border rounded-lg px-4 py-3" placeholder="Email" />
          <input className="border rounded-lg px-4 py-3 md:col-span-2" placeholder="Company name" />
          <textarea className="border rounded-lg px-4 py-3 md:col-span-2" rows="4" placeholder="What do you need help with?"></textarea>
          <button type="submit" className="px-5 py-3 rounded-xl bg-black text-white hover:opacity-90 md:col-span-2">Send</button>
        </form>
        <p className="mt-3 text-sm text-gray-500">Or email us: hello@talkwai.com</p>
      </section> */}
    </main>
  );
}

/* ---------- Small UI helpers (JS, no TS) ---------- */
function Card({ title, emoji, text }) {
  return (
    <div className="rounded-2xl border p-6 bg-white">
      <div className="text-3xl">{emoji}</div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-2 text-gray-700 text-sm">{text}</p>
    </div>
  );
}

function Step({ n, title, text }) {
  return (
    <div className="rounded-2xl border p-6">
      <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">
        {n}
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-2 text-gray-700 text-sm">{text}</p>
    </div>
  );
}

// function Quote({ text, name, quoteRole }) {
//   return (
//     <div className="rounded-2xl border p-6 bg-white">
//       <p className="text-gray-800">“{text}”</p>
//       <div className="mt-4 text-sm text-gray-600">
//         <div className="font-medium">{name}</div>
//         <div>{quoteRole}</div>
//       </div>
//     </div>
//   );
// }

function Badge({ children }) {
  return (
    <div className="inline-block rounded-full px-2 py-1 text-base text-center font-medium bg-emerald-600 text-white">
      {children}
    </div>
  );
}



// Call form component

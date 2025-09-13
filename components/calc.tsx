"use client";
import { useMemo, useState } from "react";

// AI Voice ROI & Pricing Calculator
// - $1.00/minute pricing
// - $1500/mo retainer (includes prepaid minutes)
// - Infinite rollover on unused minutes
// - Competitor cost comparison chart

function Currency({ value }) {
  const fmt = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    [],
  );
  return <span>{fmt.format(Number.isFinite(value) ? value : 0)}</span>;
}

// function Currency2dp({ value }) {
//     const fmt = useMemo(
//         () => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }),
//         []
//     );
//     return <span>{fmt.format(isFinite(value) ? value : 0)}</span>;
// }

function Number0dp({ value }) {
  const fmt = useMemo(
    () => new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }),
    [],
  );
  return <span>{fmt.format(Number.isFinite(value) ? value : 0)}</span>;
}

export default function App() {
  const [missedCallsPerDay, setMissedCallsPerDay] = useState(8);
  const [bookingRatePct, setBookingRatePct] = useState(25);
  const [avgJobValue, setAvgJobValue] = useState(350);
  const [operatingDaysPerMonth, setOperatingDaysPerMonth] = useState(22);
  const [avgCallMinutes, setAvgCallMinutes] = useState(3.0);

  const monthlyRecoveredRevenue = useMemo(() => {
    const br = bookingRatePct / 100;
    return missedCallsPerDay * br * avgJobValue * operatingDaysPerMonth;
  }, [missedCallsPerDay, bookingRatePct, avgJobValue, operatingDaysPerMonth]);

  const missedMinutesPerMonth = useMemo(() => {
    return missedCallsPerDay * avgCallMinutes * operatingDaysPerMonth;
  }, [missedCallsPerDay, avgCallMinutes, operatingDaysPerMonth]);

  // const dollarsLostPerMinute = useMemo(() => {
  //     return missedMinutesPerMonth > 0 ? monthlyRecoveredRevenue / missedMinutesPerMonth : 0;
  // }, [monthlyRecoveredRevenue, missedMinutesPerMonth]);

  return (
    <div className="w-full bg-gradient-to-b text-gray-900 mt-8">
      <div>
        {/* Inputs Card */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <header className="mx-auto max-w-6xl pb-6">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
              What Do Missed Calls Cost You?
            </h2>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputNumber
              label="Daily missed calls"
              value={missedCallsPerDay}
              onChange={setMissedCallsPerDay}
              min={0}
              step={1}
            />
            <InputNumber
              label="Booking rate (%)"
              value={bookingRatePct}
              onChange={setBookingRatePct}
              min={0}
              max={100}
              step={1}
            />
            <InputNumber
              label="Average job value ($)"
              value={avgJobValue}
              onChange={setAvgJobValue}
              min={0}
              step={10}
            />
            <InputNumber
              label="Work days / month"
              value={operatingDaysPerMonth}
              onChange={setOperatingDaysPerMonth}
              min={1}
              max={31}
              step={1}
            />
            <InputNumber
              label="Average call length (min)"
              value={avgCallMinutes}
              onChange={setAvgCallMinutes}
              min={0}
              step={0.5}
            />
          </div>
          <h2 className="text-xl font-semibold my-4">Summary</h2>
          <div className="space-y-1">
            <Row label="Monthly lost revenue (MRR)">
              <Currency value={monthlyRecoveredRevenue} />
            </Row>
            <Row label="Monthly cost to get it back">
              <Currency value={Math.max(missedMinutesPerMonth, 500)} />
            </Row>
            <Row label="Return on investment (ROI)" highlight={true}>
              <span className="text-emerald-600">
                <Number0dp
                  value={
                    monthlyRecoveredRevenue /
                    Math.max(missedMinutesPerMonth, 500)
                  }
                />
                x
              </span>
            </Row>
          </div>
        </section>
      </div>
    </div>
  );
}

function Row({ label, children, highlight = false }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${highlight ? "text-lg font-bold py-2 border-t border-gray-200 mt-2 pt-3" : ""}`}
    >
      <div
        className={highlight ? "text-gray-800 font-semibold" : "text-gray-600"}
      >
        {label}
      </div>
      <div
        className={`text-right ${highlight ? "font-bold text-lg" : "font-semibold"}`}
      >
        {children}
      </div>
    </div>
  );
}

function InputNumber({ label, value, onChange, min, max, step = 1 }) {
  return (
    <label className="block">
      <div className="mb-1 text-gray-600">{label}</div>
      <input
        type="number"
        className="w-full rounded-xl border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
      />
    </label>
  );
}

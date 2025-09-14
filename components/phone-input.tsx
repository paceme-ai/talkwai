"use client";
import { useState, useEffect } from "react";

// Phone number formatting utilities
const formatPhoneDisplay = (value: string): string => {
  // Remove all non-digits
  let digits = value.replace(/\D/g, "");

  // Remove leading '1' if present (since we show +1 as decoration)
  if (digits.startsWith("1")) {
    digits = digits.slice(1);
  }

  // Limit to 10 digits max
  digits = digits.slice(0, 10);

  // Format based on length
  if (digits.length === 0) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const formatPhoneForDB = (value: string): string => {
  // Remove all non-digits
  let digits = value.replace(/\D/g, "");

  // Remove leading '1' if present (since we always add +1 prefix)
  if (digits.startsWith("1")) {
    digits = digits.slice(1);
  }

  // Take only the last 10 digits and add +1 prefix
  digits = digits.slice(-10);
  return `+1${digits}`;
};

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  id?: string;
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = "(555) 123-4567",
  className = "",
  required = false,
  id,
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  // Initialize display value from prop
  useEffect(() => {
    if (value) {
      // If value starts with +1, remove it for display
      const cleanValue = value.startsWith("+1") ? value.slice(2) : value;
      setDisplayValue(formatPhoneDisplay(cleanValue));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneDisplay(input);
    setDisplayValue(formatted);
    
    // Convert to DB format for parent component
    const dbFormat = formatPhoneForDB(input);
    onChange(dbFormat);
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const formatted = formatPhoneDisplay(pastedText);
    setDisplayValue(formatted);
    
    // Convert to DB format for parent component
    const dbFormat = formatPhoneForDB(pastedText);
    onChange(dbFormat);
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none z-10">
        +1
      </div>
      <input
        type="tel"
        id={id}
        placeholder={placeholder}
        value={displayValue}
        onChange={handlePhoneChange}
        onPaste={handlePhonePaste}
        required={required}
        className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      />
    </div>
  );
}
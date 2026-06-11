import React from 'react';

export default function Logo({ className = "h-10 w-auto", variant = "auto" }) {
  const textFill = variant === "dark" 
    ? "#FFFFFF" 
    : variant === "light" 
      ? "#0F172A" 
      : undefined;

  const subTextFill = variant === "dark"
    ? "#CBD5E1" 
    : variant === "light"
      ? "#64748B" 
      : undefined;

  const textClass = variant === "dark" 
    ? "fill-white" 
    : variant === "light" 
      ? "fill-slate-900" 
      : "fill-slate-900 dark:fill-white";

  const subTextClass = variant === "dark"
    ? "fill-slate-300"
    : variant === "light"
      ? "fill-slate-500"
      : "fill-slate-500 dark:fill-slate-400";

  return (
    <svg viewBox="0 0 400 160" className={className} xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="80" fontFamily="'Inter', 'Arial', sans-serif" fontWeight="900" fontSize="85" textAnchor="middle" fill="#FFDE21" letterSpacing="-2">MPC</text>
      <text x="200" y="130" fontFamily="'Inter', 'Arial', sans-serif" fontWeight="900" fontSize="46" textAnchor="middle" className={textClass} fill={textFill} letterSpacing="1">REPAIRS</text>
      <text x="200" y="155" fontFamily="'Inter', 'Arial', sans-serif" fontWeight="700" fontSize="14" textAnchor="middle" className={subTextClass} fill={subTextFill} letterSpacing="3">PHONES | LAPTOPS | TABLETS</text>
    </svg>
  );
}


// src/components/Button.tsx
import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline";
}

const Button: React.FC<Props> = ({ children, variant = "primary", ...rest }) => {
  const base = "inline-flex items-center justify-center font-manrope font-bold uppercase tracking-[1px]";
  const styles =
    variant === "primary"
      ? "bg-[#000] text-white px-6 py-3 rounded-sm shadow-md hover:opacity-90"
      : "border border-black text-black px-6 py-3 rounded-sm hover:bg-black hover:text-white";

  return (
    <button className={`${base} ${styles}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;

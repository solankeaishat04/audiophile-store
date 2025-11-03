// src/components/Container.tsx
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<Props> = ({ children, className = "" }) => {
  return <div className={`w-full max-w-[1440px] mx-auto ${className}`}>{children}</div>;
};

export default Container;

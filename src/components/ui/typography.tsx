"use client";

import * as React from "react";
import Link from "next/link";

interface TypographyProps {
  children: React.ReactNode;
}

interface TypographyLinkProps extends TypographyProps {
  href: string;
}
export function TypographyHeading1({ children }: TypographyProps) {
  return <h1 className="text-3xl font-semibold text-primary">{children}</h1>;
}

export function TypographyHeading2({ children }: TypographyProps) {
  return <h2 className="text-2xl font-medium text-primary">{children}</h2>;
}

export function TypographyHeading3({ children }: TypographyProps) {
  return <h3 className="text-xl font-medium text-primary">{children}</h3>;
}

export function TypographyHeading4({ children }: TypographyProps) {
  return <h4 className="text-base font-medium text-primary">{children}</h4>;
}

export function TypographyBody({ children }: TypographyProps) {
  return <p className="text-base font-normal text-primary">{children}</p>;
}

export function TypographyLink({ href, children }: TypographyLinkProps) {
  return (
    <Link
      href={href}
      className="text-purple-700 underline underline-offset-4 hover:text-primary/80 transition-colors visited:text-purple-900"
    >
      {children}
    </Link>
  );
}
export function TypographyCaption({ children }: TypographyProps) {
  return (
    <small className="text-sm text-muted-foreground leading-none">
      {children}
    </small>
  );
}

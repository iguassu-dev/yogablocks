"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

interface TypographyLinkProps extends TypographyProps {
  href: string;
}
export function TypographyHeading1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn("text-3xl font-semibold text-primary", className)}>
      {children}
    </h1>
  );
}

export function TypographyHeading2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn("text-2xl font-medium text-primary", className)}>
      {children}
    </h2>
  );
}

export function TypographyHeading3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn("text-xl font-medium text-primary", className)}>
      {children}
    </h3>
  );
}

export function TypographyHeading4({ children, className }: TypographyProps) {
  return (
    <h4 className={cn("text-base font-medium text-primary", className)}>
      {children}
    </h4>
  );
}

export function TypographyBody({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-base font-normal text-primary", className)}>
      {children}
    </p>
  );
}

export function TypographyBulletList({ children, className }: TypographyProps) {
  return (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}>
      {children}
    </ul>
  );
}

export function TypographyOrderedList({
  children,
  className,
}: TypographyProps) {
  return (
    <ol className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)}>
      {children}
    </ol>
  );
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

export function TypographyCaption({ children, className }: TypographyProps) {
  return (
    <small
      className={cn("text-sm text-muted-foreground leading-tight", className)}
    >
      {children}
    </small>
  );
}

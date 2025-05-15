"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/markdownHelpers";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

type TypographyLinkProps = React.PropsWithChildren<{
  href: string; // ✅ explicitly required
  className?: string;
}>;

export function TypographyHeading1({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn("text-3xl font-semibold text-primary mt-8 mb-4", className)}
    >
      {children}
    </h1>
  );
}

export function TypographyHeading2({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn("text-2xl font-medium text-primary mt-6 mb-3", className)}
    >
      {children}
    </h2>
  );
}

export function TypographyHeading3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn("text-xl font-medium text-primary mt-6 mb-2", className)}>
      {children}
    </h3>
  );
}

export function TypographyHeading4({ children, className }: TypographyProps) {
  return (
    <h4
      className={cn("text-base font-medium text-primary mt-4 mb-1", className)}
    >
      {children}
    </h4>
  );
}

export function TypographyBody({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-base font-normal text-primary mt-2", className)}>
      {children}
    </p>
  );
}

export function TypographyBulletList({ children, className }: TypographyProps) {
  return (
    <ul className={cn("list-disc ml-6 mt-2 [&>li]:mt-1", className)}>
      {children}
    </ul>
  );
}

export function TypographyOrderedList({
  children,
  className,
}: TypographyProps) {
  return (
    <ol className={cn("list-decimal ml-6 mt-2 [&>li]:mt-1", className)}>
      {children}
    </ol>
  );
}

export function TypographyLink({
  href,
  children,
  className,
}: TypographyLinkProps) {
  return (
    <Link
      href={href}
      className={
        className ??
        "text-purple-700 underline underline-offset-4 hover:text-primary/80 transition-colors"
      }
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

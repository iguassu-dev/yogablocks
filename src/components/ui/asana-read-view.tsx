// src/components/ui/asana-read-view.tsx

"use client";

"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { markdownToHtml } from "@/lib/markdownHelpers";
import { TypographyHeading1 } from "@/components/ui/typography";

export function AsanaReadView({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const [renderedHtml, setRenderedHtml] = useState("");

  useEffect(() => {
    async function convert() {
      const html = await markdownToHtml(content);
      setRenderedHtml(html);
    }
    convert();
  }, [content]);

  return (
    <article className="prose prose-sm prose-primary max-w-none">
      <TypographyHeading1>{title}</TypographyHeading1>

      <div
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    </article>
  );
}

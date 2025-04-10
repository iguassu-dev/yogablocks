//The global layout that wraps everything.

// Good for things like: Global metadata (<head>), Global Tailwind container classes, Theme providers (light/dark mode), Maybe very light wrappers

import "@/app/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

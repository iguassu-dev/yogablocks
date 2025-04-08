export function TypographyHeading1({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h1 className="text-xl font-medium text-primary">{children}</h1>;
}
export function TypographyHeading2({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h1 className="text-base font-medium text-primary">{children}</h1>;
}

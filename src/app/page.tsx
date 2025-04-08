import {
  TypographyHeading1,
  TypographyHeading2,
  TypographyHeading3,
  TypographyBody,
  TypographyLink,
  TypographyCaption,
} from "@/components/ui/typography";

export default function LibraryPage() {
  return (
    <div>
      <TypographyHeading1>Welcome to the Library</TypographyHeading1>
      <TypographyHeading2>
        This is your personal yoga knowledge base.
      </TypographyHeading2>
      <TypographyHeading3>
        Here you can store all your yoga knowledge, including poses, sequences,
        and other information.
      </TypographyHeading3>
      <TypographyBody>
        This is your personal yoga knowledge base.
      </TypographyBody>
      <TypographyLink href="/">Home</TypographyLink>
      <TypographyCaption>
        This is your personal yoga knowledge base.
      </TypographyCaption>
    </div>
  );
}

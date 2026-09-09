import { readFileSync } from "node:fs";
import { join } from "node:path";

interface ImmutableLegalDocumentProps {
  document: "privacy" | "terms" | "baa";
  version: "v1" | "1.0";
}

export default function ImmutableLegalDocument({
  document,
  version,
}: ImmutableLegalDocumentProps) {
  const filePath = join(
    process.cwd(),
    "public",
    "legal",
    document,
    version,
    "document.html",
  );
  const html = readFileSync(filePath, "utf8");

  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}

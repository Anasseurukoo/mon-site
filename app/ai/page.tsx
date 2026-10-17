import type { Metadata } from "next";
import { ApprovedDojoAi } from "@/components/ai/ApprovedDojoAi";

export const metadata: Metadata = {
  title: "BBA AI — Digital Dojo",
  description: "Parlez de votre projet avec BBA AI, l’assistant de BuiltByAnas.",
  alternates: { canonical: "/ai/" },
};

export default function AiPage() {
  return <ApprovedDojoAi />;
}

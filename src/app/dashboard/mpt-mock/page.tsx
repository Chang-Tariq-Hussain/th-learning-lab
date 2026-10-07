import { redirect } from "next/navigation";

/** Old URL kept alive: it now opens Mock 1 in the Mock Tests section. */
export default function LegacyMptMockRedirect() {
  redirect("/dashboard/mock-tests/css-mpt/mock1");
}

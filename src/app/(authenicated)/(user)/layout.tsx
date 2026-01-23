import { ReactNode } from "react";
import AuthenticatedShell from "./dashboard/_components/AuthenticatedShell";

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return;
  //  <AuthenticatedShell>
  {
    children;
  }
  // </AuthenticatedShell>;
}

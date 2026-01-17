import { ReactNode } from "react";
import AuthenticatedShell from "./dashboard/_components/AuthenticatedShell";

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  //   const user = await getSignedInUser();

  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}

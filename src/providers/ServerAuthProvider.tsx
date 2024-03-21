import React from "react";
import ServerAuthContextProvider from "@/providers/ServerAuthContextProvider";
import getSession from "@/actions/getSession";

export default async function ServerAuthProvider({
  children,
  secretKey,
}: Readonly<{ children: React.ReactNode; secretKey: string }>) {
  const secret = new TextEncoder().encode(secretKey);
  const session = await getSession(secret);

  return (
    <ServerAuthContextProvider session={session}>
      {children}
    </ServerAuthContextProvider>
  );
}

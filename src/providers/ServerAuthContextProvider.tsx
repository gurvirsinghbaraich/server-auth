"use client";
import { ServerAuthContext } from "@/contexts/ServerAuthContext";
import React, { useEffect } from "react";

/**
 * This is a React component that acts as a provider for the ServerAuthContext.
 * It manages the state of the user's session and provides the session data to its child components
 * through the ServerAuthContext.
 *
 * @param session
 * @param children - The child components that will have access to the ServerAuthContext.
 * @returns A React component that wraps the child components with the ServerAuthContext.Provider.
 */
export default function ServerAuthContextProvider({
  session,
  children,
}: Readonly<{ children: React.ReactNode; session: any }>) {
  // Initialize the session state with a null value
  useEffect(function () {
    console.log(session);
  }, []);

  // Render the provider component with the session state as the value for the ServerAuthContext
  return (
    <ServerAuthContext.Provider value={{ session }}>
      {children}
    </ServerAuthContext.Provider>
  );
}

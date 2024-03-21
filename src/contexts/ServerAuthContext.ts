"use client";
import { createContext } from "react";
import { Session } from "@/interface";

/**
 * This type defines the shape of the props that will be passed to the ServerAuthContext.
 */
export type ServerAuthContextProps = {
  session: Session | null;
};

/**
 * This creates a new React context called 'ServerAuthContext' using the createContext function from React.
 * The context is initialized with an object that has a 'session' property set to null.
 *
 * This context can be used to share the current user's session data across multiple components in
 * a React application. Components can subscribe to changes in the session data by using the
 * useContext hook provided by React.
 *
 * To use this context, you need to provide a value for the 'session' property, which can be either
 * a Session object or null, depending on whether the user is authenticated or not.
 */
export const ServerAuthContext = createContext<ServerAuthContextProps>({
  session: null,
});

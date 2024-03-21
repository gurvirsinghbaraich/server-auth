import { ServerAuthContext } from "@/contexts/ServerAuthContext";
import { useContext } from "react";
import { ServerAuthConfiguration } from "..";

type Session = ReturnType<
  NonNullable<ServerAuthConfiguration["actions"]["signin"]>
>;

export default function useSession() {
  const { session } = useContext(ServerAuthContext);

  return session as Session;
}

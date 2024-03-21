import { ServerAuthConfiguration } from "@/interface";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function getSession(key: Uint8Array) {
  const sessionCookie = cookies().get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  return (
    await jwtVerify(sessionCookie, key, {
      algorithms: ["HS256"],
    })
  )?.payload;
}

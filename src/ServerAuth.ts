import { handler } from "@/handler";
import { ServerAuthConfiguration } from "@/interface";
import { SignJWT } from "jose";
import { NextRequest } from "next/server";

export class ServerAuth<T = any> {
  /**
   * Holds the secret string used for signing and verifying session data.
   * This property is marked as optional because it is initialized in the constructor.
   */
  private readonly secretUnit8Array: Uint8Array | undefined;
  private readonly serverAuthConfiguration: ServerAuthConfiguration<T>;

  public get configuration(): ServerAuthConfiguration<T> {
    return this.serverAuthConfiguration!;
  }

  public get authentication() {
    const secretUnit8Array = this.secretUnit8Array!;

    return {
      encrypt: (payload: any) => {
        return new SignJWT(payload)
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime(`${24 * 60 * 60} sec from now`)
          .sign(secretUnit8Array);
      },
    };
  }

  /**
   * The constructor takes a ServerAuthConfiguration object as an argument.
   *
   * @param configuration - An object containing the server authentication configuration,
   *                        including the 'secret' property.
   */
  constructor(configuration: ServerAuthConfiguration<T>) {
    const secret = configuration?.secret;

    if (!secret) {
      throw new Error(
        "The'secret' property is required in the ServerAuthConfiguration object."
      );
    }

    this.secretUnit8Array = new TextEncoder().encode(secret);
    this.serverAuthConfiguration = configuration;
  }
}

/**
 * This function wraps the server authentication logic and creates a request handler
 * that can be used in Next.js API routes.
 *
 * @param serverAuth - An instance of the ServerAuth class, which encapsulates
 *                     the server authentication configuration and logic.
 * @returns An object containing the request handlers for the GET and POST HTTP methods.
 */
export function ServerAuthWrapper(serverAuth: ServerAuth) {
  /**
   * This function is the actual request handler that will be called for both
   * GET and POST requests. It takes a NextRequest object as an argument and
   * passes it along with the serverAuth instance to the 'handler' function.
   *
   * @param request - The incoming NextRequest object representing the HTTP request.
   */
  const requestHandler = async (request: NextRequest) =>
    await handler(request, serverAuth);

  // Return an object with the request handlers for POST methods
  return {
    POST: requestHandler,
  };
}

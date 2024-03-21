import { NextRequest, NextResponse } from "next/server";

/**
 * Represents the possible response types that a middleware function can return.
 * It is an object containing a 'redirect' property, which is an object with a mandatory 'url'
 * property (the URL to redirect to) and an optional 'permanent' property (indicating whether
 * the redirection should be permanent or temporary).
 */
type MiddlewareResponse = {
  redirect: {
    url: string;
    permanent?: boolean;
  };
};

type MiddlewareFunction = (
  request: NextRequest,
  response: NextResponse,
) => boolean | MiddlewareResponse;

/**
 * This is a default middleware function that takes a NextRequest object and a NextResponse object as input.
 * It sets the 'Request-Url' header in the response with the value of the request URL.
 * It currently returns 'true', indicating that the request should be allowed to proceed.
 *
 * @param request - The incoming NextRequest object representing the HTTP request.
 * @param response
 * @returns A boolean value indicating whether the request should be allowed to proceed or not.
 */
export default function middleware(
  request: NextRequest,
  response: NextResponse,
): boolean {
  response.headers.set("Request-Url", request.nextUrl.toString());
  return true;
}

// Define a recursive function to execute the middleware stack

/**
 * This function creates a middleware stack by composing multiple middleware functions.
 * It takes an array of middleware functions as input and returns a single function
 * that executes the middleware stack for each incoming request.
 *
 * @param middlewares - An array of middleware functions that should be executed in order.
 *                      Each middleware function should have the signature:
 *                      (request: NextRequest, response: NextResponse) => boolean | MiddlewareResponse
 * @returns A function that takes a NextRequest object as input and executes the middleware stack.
 *          The returned function has the signature: (request: NextRequest) => void
 */
export const createMiddlewareStack =
  (middlewares: MiddlewareFunction[]) => (request: NextRequest) => {
    const response = NextResponse.next();
    // Create a copy of the 'middlewares' array to avoid modifying the original
    const stack = [...middlewares];

    const executeMiddleware = (): NextResponse => {
      // If the stack is empty, return the current response (base case)
      if (stack.length === 0) {
        return response;
      }

      // Get the next middleware function from the stack
      const middleware = stack.shift() as MiddlewareFunction;
      // Execute the middleware function with the request and current response
      const middlewareResponse = middleware(request, response);

      // If the middleware function returns a boolean, and it's true, recursively call 'executeMiddleware' with the current response
      if (typeof middlewareResponse === "boolean" && middlewareResponse) {
        return executeMiddleware();
      }
      // If the middleware function returns a MiddlewareResponse object
      else if (typeof middlewareResponse === "object") {
        // Get the first key of the MiddlewareResponse object
        const key = Object.keys(
          middlewareResponse,
        )[0] as keyof MiddlewareResponse;

        // Handle the different cases based on the key
        switch (key) {
          case "redirect": {
            // If the key is 'redirect', perform the redirection
            // Construct the appropriate status code based on whether the redirection is permanent or temporary
            let redirectUrl = middlewareResponse[key].url;
            const statusCode = middlewareResponse[key].permanent ? 308 : 307;

            if (!URL.canParse(redirectUrl)) {
              redirectUrl = new URL(
                redirectUrl,
                request.nextUrl.origin,
              ).toString();
            }

            // Return a new response with the redirection
            return NextResponse.redirect(redirectUrl, statusCode);
          }
          default: {
            // If the key is not 'redirect', throw an error (unsupported key)
            throw new Error(
              `ReturnError: Invalid key '${key}' returned from '${middleware.name}' middleware!`,
            );
          }
        }
      }
      // If the middleware function returns an invalid type
      else {
        // Throw an error
        throw new Error(
          `ReturnError: Invalid ReturnType from '${middleware.name}' middleware!`,
        );
      }
    };

    // Return the 'executeMiddleware' function, passing it an initial 'NextResponse.next()' response
    // This starts the execution of the middleware stack
    return executeMiddleware();
  };

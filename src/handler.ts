import { ServerAuth } from "@/ServerAuth";
import signIn from "@/actions/signin";
import { ServerAuthRoutes } from "@/interface";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * This function is a request handler responsible for handling authentication-related requests
 * in a Next.js application. It takes a NextRequest object and a ServerAuth instance as input.
 *
 * @param request - The incoming NextRequest object representing the HTTP request.
 * @param serverAuth - An instance of the ServerAuth class, which encapsulates the server authentication configuration and logic.
 * @returns A NextResponse object containing the appropriate response for the requested action.
 */
export const handler = async function (
  request: NextRequest,
  serverAuth: ServerAuth
) {
  // Get the HTTP request method (e.g., GET, POST)
  const requestMethod = request.method;

  // Extract the requested action from the URL path
  const requestedAction: string = request.nextUrl.pathname.replace(
    /.*(\/.*)/gm,
    "$1"
  );

  // Define default paths for authentication routes
  const paths = serverAuth.configuration.paths ?? {
    "/signin": ServerAuthRoutes.SIGNIN,
    "/signup": ServerAuthRoutes.SIGNUP,
    "/signout": ServerAuthRoutes.SIGNOUT,
  };

  // Handle POST requests for authentication actions
  if (requestMethod === "POST") {
    // Get the list of available paths
    const keys = Object.keys(paths);

    // Check if the requested action is a valid path
    if (!keys.includes(requestedAction)) {
      // If the requested action is not found, return a 404 error
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    // Switch statement to handle different authentication actions
    switch (paths[requestedAction]) {
      case ServerAuthRoutes.SIGNIN:
        // Handle the sign-in action
        return await signInHandler(request, serverAuth);

      case ServerAuthRoutes.SIGNUP:
        // Handle the sign-up action
        return signUpHandler();

      case ServerAuthRoutes.SIGNOUT:
        // Handle the sign-out action
        return signOutHandler();
    }
  }
};

const signInHandler = async (request: NextRequest, serverAuth: ServerAuth) => {
  const headerMap = headers();
  const contentType = headerMap.get("Content-Type") as
    | "application/x-www-form-urlencoded"
    | "application/json";

  if (!contentType) {
    return NextResponse.json(
      { message: "Content-Type header not found" },
      { status: 400 }
    );
  }

  if (
    contentType !== "application/json" &&
    contentType !== "application/x-www-form-urlencoded"
  ) {
    return NextResponse.json(
      { message: "Invalid Content-Type header" },
      { status: 400 }
    );
  }

  const payload: { [K: string]: any } = {};

  switch (contentType) {
    case "application/json": {
      return NextResponse.json({
        message: "Under Development",
      });
    }

    case "application/x-www-form-urlencoded": {
      const formData = await request.formData();

      formData.forEach((value, key) => {
        payload[key] = value;
      });
    }
  }

  const sessionCookieValue = await signIn(payload, serverAuth);

  const response = new NextResponse(
    `<script>window.location.href = '${request.nextUrl.origin}'</script>`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );

  response.cookies.set("session", sessionCookieValue, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  return response;
};

/**
 * This function handles the sign-up action for registration.
 * It should implement the necessary logic for creating a new user account
 * and returning an appropriate response.
 *
 * @returns A NextResponse object containing the response for the sign-up action.
 */
const signUpHandler = function () {};

/**
 * This function handles the sign-out action for authentication.
 * It should implement the necessary logic for terminating the current user session,
 * invalidating the session data, and returning an appropriate response.
 *
 * @returns A NextResponse object containing the response for the sign-out action.
 */
const signOutHandler = function () {
  // Implement sign-out logic here
};

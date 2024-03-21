import { ServerAuth } from "@/ServerAuth";

/**
 * This function handles the sign-in process for user authentication.
 *
 * @param payload - The data payload containing the user's sign-in credentials or any other relevant data.
 * @param serverAuth - An instance of the ServerAuth class, which encapsulates the server authentication configuration and logic.
 * @returns A NextResponse object containing the user's session data in JSON format.
 */
export default async function signIn(payload: any, serverAuth: ServerAuth) {
  // Get the list of fields required for signing in from the server authentication configuration
  const fields =
    serverAuth.configuration.actions?.signin?.(payload) ?? Object.keys(payload);

  // Initialize an empty session object with the same structure as the fields
  let session: (typeof fields)[keyof typeof fields] = {};

  // If fields are available, assign them to the session object
  if (fields) {
    session = fields;
  }

  // Call the 'signingCookie' action from the server authentication configuration to modify the session data
  const modifiedSession =
    serverAuth.configuration.actions?.signingCookie?.(session) ?? session;

  return await serverAuth.authentication.encrypt(modifiedSession);
}

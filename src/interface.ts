export enum ServerAuthRoutes {
  SIGNIN,
  SIGNUP,
  SIGNOUT,
}

export interface ServerAuthConfiguration<T = any> {
  /**
   * This is a secret string that will be used to securely sign and verify the session data.
   * It should be a long, random, and highly secure string to prevent unauthorized access
   * or tampering with the session data. This secret should be kept confidential and
   * should never be exposed or shared with untrusted parties.
   */
  secret: string;

  /**
   * This object contains various functions or methods that handle different
   * authentication-related operations, such as:
   *
   * - signin: Responsible for authenticating a user and creating a new session.
   * - signup: Handles the registration process for new users.
   * - signout: Terminates the current user session and invalidates the session data.
   * - signingCookie: Generates a secure, signed cookie for storing session data on the client-side.
   *
   * Each action function may take relevant parameters (e.g., user credentials, session data)
   * and perform the necessary operations, such as validating user input, interacting with
   * a database, generating session tokens or cookies, and managing session state.
   */
  actions: {
    signin?: (payload: any) => T;
    signingCookie?: (payload: T) => {};
  };

  paths?: {
    [K: string]: ServerAuthRoutes;
  };
}

export interface Session {
  /**
   * This interface represents the structure of a user session.
   * It can include properties such as:
   *
   * - userId: The unique identifier of the authenticated user.
   * - sessionId: A unique identifier for the current session.
   * - expirationTime: The timestamp when the session will expire and become invalid.
   * - userAgent: Information about the client's user agent (browser, device, etc.).
   * - ip: The IP address of the client for tracking or security purposes.
   * - roles: An array of roles or permissions associated with the user.
   *
   * Add or modify properties as needed to suit your application's session management requirements.
   */
}

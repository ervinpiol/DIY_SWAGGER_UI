export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiParameter {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  required: boolean;
  type: string;
  description?: string;
}

export interface ApiRequestBody {
  description?: string;
  content: {
    "application/json": {
      schema: {
        type: string;
        properties?: Record<
          string,
          { type: string; description?: string; example?: any }
        >;
        items?: { type: string; properties?: Record<string, any> };
      };
      example?: any;
    };
  };
}

export interface ApiResponse {
  status: number;
  description: string;
  content?: {
    "application/json": {
      schema: {
        type: string;
        properties?: Record<
          string,
          { type: string; description?: string; example?: any }
        >;
        items?: { type: string; properties?: Record<string, any> };
      };
      example?: any;
    };
  };
}

export interface ApiEndpoint {
  method: Method;
  path: string;
  summary: string;
  description?: string;
  tags?: string[];
  parameters?: ApiParameter[];
  requestBody?: ApiRequestBody;
  responses?: ApiResponse[];
}

export interface ApiSection {
  title: string;
  description?: string;
  endpoints: ApiEndpoint[];
}

export const apiSpec: ApiSection[] = [
  {
    title: "User API",
    description: "Operations available to end users. Runs on port 8081.",
    endpoints: [
      {
        method: "GET",
        path: "/health",
        summary: "Health Check",
        description: "Checks if the service is up and running.",
        tags: ["Health"],
        responses: [
          {
            status: 200,
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: { status: "ok" },
              },
            },
          },
        ],
      },
      {
        method: "POST",
        path: "/api/v1/auth/register",
        summary: "Register User",
        description: "Register a new user account.",
        tags: ["Auth"],
        requestBody: {
          description: "User registration details",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    description: "User email address",
                    example: "user@example.com",
                  },
                  password: {
                    type: "string",
                    description: "User password",
                    example: "strongpassword123",
                  },
                  firstName: {
                    type: "string",
                    description: "First name",
                    example: "John",
                  },
                  lastName: {
                    type: "string",
                    description: "Last name",
                    example: "Doe",
                  },
                },
              },
              example: {
                email: "user@example.com",
                password: "strongpassword123",
                firstName: "John",
                lastName: "Doe",
              },
            },
          },
        },
        responses: [
          { status: 201, description: "User registered successfully" },
          { status: 400, description: "Invalid input" },
        ],
      },
      {
        method: "POST",
        path: "/api/v1/auth/login",
        summary: "Login",
        description: "Authenticate user and receive access tokens.",
        tags: ["Auth"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "user@example.com" },
                  password: { type: "string", example: "password123" },
                },
              },
              example: { email: "user@example.com", password: "password123" },
            },
          },
        },
        responses: [
          {
            status: 200,
            description: "Login successful",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
              },
            },
          },
          { status: 401, description: "Unauthorized" },
        ],
      },
      {
        method: "POST",
        path: "/api/v1/auth/logout",
        summary: "Logout",
        description: "Invalidate the current session.",
        tags: ["Auth"],
        responses: [{ status: 200, description: "Logged out successfully" }],
      },
      {
        method: "POST",
        path: "/api/v1/auth/password/reset-request",
        summary: "Password Reset Request",
        description: "Request a password reset email.",
        tags: ["Auth"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "user@example.com" },
                },
              },
              example: { email: "user@example.com" },
            },
          },
        },
        responses: [
          { status: 200, description: "Reset email sent if email exists" },
        ],
      },
      {
        method: "POST",
        path: "/api/v1/auth/password/reset",
        summary: "Password Reset",
        description: "Reset password using a token.",
        tags: ["Auth"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string", example: "reset-token-123" },
                  newPassword: {
                    type: "string",
                    example: "newSecurePassword!",
                  },
                },
              },
              example: {
                token: "reset-token-123",
                newPassword: "newSecurePassword!",
              },
            },
          },
        },
        responses: [
          { status: 200, description: "Password reset successful" },
          { status: 400, description: "Invalid token" },
        ],
      },
      {
        method: "GET",
        path: "/api/v1/dashboard",
        summary: "Get Dashboard",
        description:
          "Retrieve dashboard information for the authenticated user.",
        tags: ["Dashboard"],
        responses: [
          {
            status: 200,
            description: "Dashboard data",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  balance: 10500.5,
                  transactions: 12,
                  notifications: 3,
                },
              },
            },
          },
        ],
      },
      {
        method: "GET",
        path: "/api/v1/kyc/status",
        summary: "Get KYC Status",
        description: "Check the current KYC status of the user.",
        tags: ["KYC"],
        responses: [
          {
            status: 200,
            description: "KYC Status",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  status: "verified",
                  level: 2,
                  verifiedAt: "2024-01-15T10:00:00Z",
                },
              },
            },
          },
        ],
      },
      {
        method: "POST",
        path: "/api/v1/kyc/start",
        summary: "Start KYC",
        description: "Initiate the KYC verification process.",
        tags: ["KYC"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  documentType: { type: "string", example: "passport" },
                  documentNumber: { type: "string", example: "AB123456" },
                },
              },
              example: { documentType: "passport", documentNumber: "AB123456" },
            },
          },
        },
        responses: [{ status: 200, description: "KYC process initiated" }],
      },
      {
        method: "GET",
        path: "/api/v1/wallet-addresses",
        summary: "List Wallet Addresses",
        description: "Get a list of registered wallet addresses.",
        tags: ["Wallet"],
        responses: [
          {
            status: 200,
            description: "List of wallets",
            content: {
              "application/json": {
                schema: { type: "array" },
                example: [
                  { id: "w_1", label: "Primary", address: "0x123...abc" },
                  { id: "w_2", label: "Savings", address: "0x456...def" },
                ],
              },
            },
          },
        ],
      },
      {
        method: "POST",
        path: "/api/v1/wallet-addresses",
        summary: "Create Wallet Address",
        description: "Register a new wallet address.",
        tags: ["Wallet"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  label: { type: "string", example: "My Wallet" },
                  address: { type: "string", example: "0x789...ghi" },
                },
              },
              example: { label: "My Wallet", address: "0x789...ghi" },
            },
          },
        },
        responses: [{ status: 201, description: "Wallet added" }],
      },
      {
        method: "DELETE",
        path: "/api/v1/wallet-addresses/:id",
        summary: "Delete Wallet Address",
        description: "Remove a wallet address.",
        tags: ["Wallet"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
            description: "Wallet ID",
          },
        ],
        responses: [{ status: 200, description: "Wallet removed" }],
      },
    ],
  },
  {
    title: "Admin API",
    description: "Operations for administrators. Runs on port 8082.",
    endpoints: [
      {
        method: "GET",
        path: "/health",
        summary: "Health Check",
        description: "Checks if the admin service is up.",
        tags: ["Health"],
        responses: [
          {
            status: 200,
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: { status: "ok" },
              },
            },
          },
        ],
      },
      {
        method: "POST",
        path: "/api/v1/auth/login",
        summary: "Admin Login",
        description: "Authenticate admin and receive tokens.",
        tags: ["Auth"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "admin" },
                  password: { type: "string", example: "adminPass" },
                },
              },
              example: { username: "admin", password: "adminPass" },
            },
          },
        },
        responses: [
          { status: 200, description: "Login successful" },
          { status: 401, description: "Invalid credentials" },
        ],
      },
      {
        method: "POST",
        path: "/api/v1/auth/logout",
        summary: "Admin Logout",
        description: "Logout from admin session.",
        tags: ["Auth"],
        responses: [{ status: 200, description: "Logged out" }],
      },
      {
        method: "GET",
        path: "/api/v1/dashboard",
        summary: "Admin Dashboard",
        description: "Get admin dashboard statistics.",
        tags: ["Dashboard"],
        responses: [
          {
            status: 200,
            description: "Stats retrieved",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: { totalUsers: 1543, activeToday: 120 },
              },
            },
          },
        ],
      },
      {
        method: "GET",
        path: "/api/v1/users",
        summary: "List Users",
        description: "Retrieve a paginated list of users.",
        tags: ["Users"],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            type: "integer",
            description: "Page number",
          },
          {
            name: "limit",
            in: "query",
            required: false,
            type: "integer",
            description: "Items per page",
          },
        ],
        responses: [{ status: 200, description: "List of users" }],
      },
      {
        method: "GET",
        path: "/api/v1/users/:id",
        summary: "Get User",
        description: "Get details of a specific user.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
            description: "User ID",
          },
        ],
        responses: [
          { status: 200, description: "User details found" },
          { status: 404, description: "User not found" },
        ],
      },
      {
        method: "GET",
        path: "/api/v1/users/:id/account",
        summary: "Get User Account",
        description: "Get account balances for a user.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
            description: "User ID",
          },
        ],
        responses: [{ status: 200, description: "Account details" }],
      },
      {
        method: "POST",
        path: "/api/v1/users/:id/suspend",
        summary: "Suspend User",
        description: "Suspend a user account.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
            description: "User ID",
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  reason: { type: "string", example: "Suspicious activity" },
                },
              },
              example: { reason: "Suspicious activity" },
            },
          },
        },
        responses: [{ status: 200, description: "User suspended" }],
      },
      {
        method: "POST",
        path: "/api/v1/users/:id/freeze",
        summary: "Freeze User",
        description: "Freeze a user account.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
            description: "User ID",
          },
        ],
        responses: [{ status: 200, description: "User frozen" }],
      },
      {
        method: "POST",
        path: "/api/v1/users/:id/activate",
        summary: "Activate User",
        description: "Re-activate a user account.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
            description: "User ID",
          },
        ],
        responses: [{ status: 200, description: "User activated" }],
      },
      {
        method: "GET",
        path: "/api/v1/kyc/pending",
        summary: "List Pending KYC",
        description: "Get list of users waiting for KYC approval.",
        tags: ["KYC"],
        responses: [{ status: 200, description: "Pending KYC list" }],
      },
      {
        method: "POST",
        path: "/api/v1/kyc/:id/approve",
        summary: "Approve KYC",
        description: "Approve a KYC application.",
        tags: ["KYC"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
            description: "KYC Application ID",
          },
        ],
        responses: [{ status: 200, description: "KYC Approved" }],
      },
      {
        method: "POST",
        path: "/api/v1/kyc/:id/reject",
        summary: "Reject KYC",
        description: "Reject a KYC application.",
        tags: ["KYC"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
            description: "KYC Application ID",
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  reason: { type: "string", example: "Docs unclear" },
                },
              },
              example: { reason: "Docs unclear" },
            },
          },
        },
        responses: [{ status: 200, description: "KYC Rejected" }],
      },
    ],
  },
];

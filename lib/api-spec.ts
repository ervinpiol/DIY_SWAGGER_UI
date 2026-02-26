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
                    example: "Password1!",
                  },
                  confirm_password: {
                    type: "string",
                    description: "Confirm password",
                    example: "Password1!",
                  },
                  phone_number: {
                    type: "string",
                    description: "Phone number (E.164 format)",
                    example: "+819012345678",
                  },
                },
              },
              example: {
                email: "user@example.com",
                password: "Password1!",
                confirm_password: "Password1!",
                phone_number: "+819012345678",
              },
            },
          },
        },
        responses: [
          {
            status: 200,
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  data: {
                    user_id: "f718efdd-316a-4a42-a568-7ba184f50c1f",
                    email: "user@example.com",
                    message: "User registered successfully",
                  },
                  error: null,
                },
              },
            },
          },
          { status: 409, description: "User already exists" },
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
                  password: { type: "string", example: "Password1!" },
                },
              },
              example: { email: "user@example.com", password: "Password1!" },
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
                example: {
                  data: {
                    access_token: "eyJhbGci...",
                    refresh_token: "eyJhbGci...",
                    expires_in: 86400,
                    refresh_expires_in: 604800,
                  },
                  error: null,
                },
              },
            },
          },
          {
            status: 401,
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  data: null,
                  error: {
                    code: "AUTH_INVALID_CREDENTIALS",
                    message: "invalid credentials",
                  },
                },
              },
            },
          },
        ],
      },
      {
        method: "POST",
        path: "/api/v1/auth/logout",
        summary: "Logout",
        description: "Invalidate the current session.",
        tags: ["Auth"],
        responses: [
          {
            status: 200,
            description: "Logged out successfully",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  data: { success: true },
                  error: null,
                },
              },
            },
          },
        ],
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
                  new_password: {
                    type: "string",
                    example: "newSecurePassword!",
                  },
                },
              },
              example: {
                token: "reset-token-123",
                new_password: "newSecurePassword!",
              },
            },
          },
        },
        responses: [
          { status: 200, description: "Password reset successful" },
          {
            status: 400,
            description: "Invalid token",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  data: null,
                  error: {
                    code: "AUTH_RESET_TOKEN_INVALID",
                    message: "invalid token",
                  },
                },
              },
            },
          },
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
                  data: {
                    message: "dashboard",
                    user_id: "f718efdd-316a-4a42-a568-7ba184f50c1f",
                  },
                  error: null,
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
        parameters: [
          { name: "limit", in: "query", required: false, type: "integer" },
          { name: "cursor", in: "query", required: false, type: "string" },
          { name: "sort", in: "query", required: false, type: "string" },
          { name: "order", in: "query", required: false, type: "string" },
        ],
        responses: [
          {
            status: 200,
            description: "List of wallets",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  data: {
                    wallets: [
                      {
                        id: "w_1",
                        label: "Primary",
                        address: "0x123...abc",
                        network: "ETH",
                      },
                    ],
                  },
                  error: null,
                },
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
                  address: { type: "string", example: "0x123...abc" },
                  network: { type: "string", example: "ETH" },
                },
              },
              example: {
                label: "My Wallet",
                address: "0x123...abc",
                network: "ETH",
              },
            },
          },
        },
        responses: [
          {
            status: 201,
            description: "Wallet added",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  data: { id: "w_3", success: true },
                  error: null,
                },
              },
            },
          },
        ],
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
                  email: { type: "string", example: "superadmin@mfb.com" },
                  password: { type: "string", example: "sup3rAdm!n" },
                },
              },
              example: {
                email: "superadmin@mfb.com",
                password: "sup3rAdm!n",
              },
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
                example: {
                  data: {
                    access_token: "eyJhbGci...",
                    refresh_token: "eyJhbGci...",
                  },
                  error: null,
                },
              },
            },
          },
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
            name: "limit",
            in: "query",
            required: false,
            type: "integer",
            description: "Items per page",
          },
          {
            name: "cursor",
            in: "query",
            required: false,
            type: "string",
            description: "Pagination cursor",
          },
          {
            name: "sort",
            in: "query",
            required: false,
            type: "string",
            description: "Field to sort by",
          },
          {
            name: "order",
            in: "query",
            required: false,
            type: "string",
            description: "Sort order (asc/desc)",
          },
        ],
        responses: [{ status: 200, description: "List of users" }],
      },
      {
        method: "GET",
        path: "/api/v1/users/:id",
        summary: "Get User",
        description:
          "Get details of a specific user including profile and account summary.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
            description: "User UUID",
          },
        ],
        responses: [
          {
            status: 200,
            description: "User details found",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  data: {
                    id: "44444444-4444-...-000000000018",
                    email: "user20@example.com",
                    status: "FROZEN",
                    kyc_status: "PENDING",
                    profile: {
                      full_name: "清水 香織",
                      full_name_kana: "シードユーザー 20",
                      date_of_birth: "1990-01-19",
                      postal_code: "118-0001",
                      address: "東京都大田区...",
                    },
                    account: {
                      id: "55555555-...",
                      balances: { JPY: "230000" },
                    },
                  },
                  error: null,
                },
              },
            },
          },
        ],
      },
      {
        method: "GET",
        path: "/api/v1/users/:id/account",
        summary: "Get User Account",
        description: "Get account balances for a user.",
        tags: ["Users"],
        parameters: [
          { name: "id", in: "path", required: true, type: "string" },
        ],
        responses: [
          {
            status: 200,
            description: "Account details",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  data: {
                    id: "55555555-...",
                    balances: { JPY: "230000" },
                  },
                  error: null,
                },
              },
            },
          },
        ],
      },
      {
        method: "GET",
        path: "/api/v1/users/:id/transactions",
        summary: "Get User Transactions",
        description: "List transactions for a specific user.",
        tags: ["Users"],
        parameters: [
          { name: "id", in: "path", required: true, type: "string" },
          { name: "limit", in: "query", required: false, type: "integer" },
          { name: "cursor", in: "query", required: false, type: "string" },
        ],
        responses: [
          {
            status: 200,
            description: "Transaction list",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  data: {
                    transactions: [
                      {
                        id: "f0100001-...",
                        type: "DEPOSIT",
                        amount: "500000",
                        currency: "JPY",
                        created_at: "2026-02-17T00:57:50Z",
                      },
                    ],
                  },
                  error: null,
                },
              },
            },
          },
        ],
      },
      {
        method: "POST",
        path: "/api/v1/users/:id/suspend",
        summary: "Suspend User",
        description: "Suspend a user account.",
        tags: ["Users"],
        parameters: [
          { name: "id", in: "path", required: true, type: "string" },
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
        responses: [
          {
            status: 200,
            description: "User suspended",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  data: { id: "44444444-...", status: "SUSPENDED" },
                  error: null,
                },
              },
            },
          },
        ],
      },
      {
        method: "POST",
        path: "/api/v1/users/:id/freeze",
        summary: "Freeze User",
        description: "Freeze a user account.",
        tags: ["Users"],
        parameters: [
          { name: "id", in: "path", required: true, type: "string" },
        ],
        responses: [
          {
            status: 200,
            description: "User frozen",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  data: { id: "44444444-...", status: "FROZEN" },
                  error: null,
                },
              },
            },
          },
        ],
      },
      {
        method: "POST",
        path: "/api/v1/users/:id/activate",
        summary: "Activate User",
        description: "Re-activate a user account.",
        tags: ["Users"],
        parameters: [
          { name: "id", in: "path", required: true, type: "string" },
        ],
        responses: [
          {
            status: 200,
            description: "User activated",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  data: { id: "44444444-...", status: "ACTIVE" },
                  error: null,
                },
              },
            },
          },
        ],
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

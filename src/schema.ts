// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { Validator, v } from "convex/values";

// The users, accounts, sessions and verificationTokens tables are modeled
// from https://authjs.dev/getting-started/adapters#models

export const userSchema = {
  email: v.string(),
  name: v.optional(v.string()),
  emailVerified: v.optional(v.number()),
  image: v.optional(v.string()),
};

export const sessionSchema = {
  userId: v.id("users"),
  expires: v.number(),
  sessionToken: v.string(),
};

export const accountSchema = {
  userId: v.id("users"),
  type: v.union(
    v.literal("email"),
    v.literal("oidc"),
    v.literal("oauth"),
    v.literal("webauthn")
  ),
  provider: v.string(),
  providerAccountId: v.string(),
  refresh_token: v.optional(v.string()),
  access_token: v.optional(v.string()),
  expires_at: v.optional(v.number()),
  token_type: v.optional(v.string() as Validator<Lowercase<string>>),
  scope: v.optional(v.string()),
  id_token: v.optional(v.string()),
  session_state: v.optional(v.string()),
};

export const verificationTokenSchema = {
  identifier: v.string(),
  token: v.string(),
  expires: v.number(),
};

export const authenticatorSchema = {
  credentialID: v.string(),
  userId: v.id("users"),
  providerAccountId: v.string(),
  credentialPublicKey: v.string(),
  counter: v.number(),
  credentialDeviceType: v.string(),
  credentialBackedUp: v.boolean(),
  transports: v.optional(v.string()),
};

const authTables = {
  users: defineTable(userSchema).index("email", ["email"]),
  sessions: defineTable(sessionSchema)
    .index("sessionToken", ["sessionToken"])
    .index("userId", ["userId"]),
  accounts: defineTable(accountSchema)
    .index("providerAndAccountId", ["provider", "providerAccountId"])
    .index("userId", ["userId"]),
  verificationTokens: defineTable(verificationTokenSchema).index(
    "identifierToken",
    ["identifier", "token"]
  ),
  authenticators: defineTable(authenticatorSchema)
    .index("userId", ["userId"])
    .index("credentialID", ["credentialID"]),
};

export default defineSchema({
  ...authTables,
  // your other tables
  // or pass `strictTableNameTypes: false`
  // in the second argument argument to `defineSchema`
});

// users: defineTable({
//   name: v.optional(v.string()),
//   email: v.string(),
//   emailVerified: v.optional(v.boolean()),
//   image: v.optional(v.string()),
//   hashedPassword: v.optional(v.string()), // Make this optional
//   createdAt: v.number(),
//   updatedAt: v.number(),
// }).index("by_email", ["email"]),

// workspaces: defineTable({
//   name: v.string(),
//   description: v.optional(v.string()),
//   createdAt: v.number(),
//   updatedAt: v.number(),
//   ownerId: v.id("users"),
// }),

// workspaceMembers: defineTable({
//   workspaceId: v.id("workspaces"),
//   userId: v.id("users"),
//   role: v.string(),
//   createdAt: v.number(),
//   updatedAt: v.number(),
// }).index("by_workspace_and_user", ["workspaceId", "userId"]),

// pages: defineTable({
//   title: v.string(),
//   icon: v.optional(v.string()),
//   cover: v.optional(v.string()),
//   createdAt: v.number(),
//   updatedAt: v.number(),
//   workspaceId: v.id("workspaces"),
//   parentId: v.optional(v.id("pages")),
//   authorId: v.id("users"),
// })
//   .index("by_workspace", ["workspaceId"])
//   .index("by_parent", ["parentId"]),

// blocks: defineTable({
//   type: v.string(),
//   content: v.any(),
//   order: v.number(),
//   createdAt: v.number(),
//   updatedAt: v.number(),
//   pageId: v.id("pages"),
//   authorId: v.id("users"),
// }).index("by_page", ["pageId"]),

// comments: defineTable({
//   content: v.string(),
//   createdAt: v.number(),
//   updatedAt: v.number(),
//   pageId: v.id("pages"),
//   authorId: v.id("users"),
// }).index("by_page", ["pageId"]),

// activities: defineTable({
//   type: v.string(),
//   entityType: v.string(),
//   entityId: v.id("users"), // Changed this to v.id("users")
//   details: v.optional(v.any()),
//   createdAt: v.number(),
//   userId: v.id("users"),
// }).index("by_user", ["userId"]),

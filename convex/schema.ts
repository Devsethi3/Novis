import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    emailVerified: v.optional(v.boolean()),
    image: v.optional(v.string()),
    hashedPassword: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  workspaces: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    ownerId: v.id("users"),
  }),

  workspaceMembers: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace_and_user", ["workspaceId", "userId"]),

  pages: defineTable({
    title: v.string(),
    icon: v.optional(v.string()),
    cover: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    workspaceId: v.id("workspaces"),
    parentId: v.optional(v.id("pages")),
    authorId: v.id("users"),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_parent", ["parentId"]),

  blocks: defineTable({
    type: v.string(),
    content: v.any(),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    pageId: v.id("pages"),
    authorId: v.id("users"),
  }).index("by_page", ["pageId"]),

  comments: defineTable({
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    pageId: v.id("pages"),
    authorId: v.id("users"),
  }).index("by_page", ["pageId"]),

  activities: defineTable({
    type: v.string(),
    entityType: v.string(),
    entityId: v.id("users"), // Changed this to v.id("users")
    details: v.optional(v.any()),
    createdAt: v.number(),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),
});

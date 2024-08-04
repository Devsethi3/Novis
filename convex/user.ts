// convex/user.ts

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    hashedPassword: v.string(),
    provider: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      hashedPassword: args.hashedPassword,
      provider: args.provider,
    });
    return { _id: userId };
  },
});

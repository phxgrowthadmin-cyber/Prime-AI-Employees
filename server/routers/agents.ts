import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const agentsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Fetch agents for organization
    return [];
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        role: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Create agent
      return { id: 'temp', ...input };
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // TODO: Get agent by ID
      return null;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Update agent
      return { id: input.id };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Delete agent
      return { id: input.id };
    }),
});

import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const subscriptionRouter = router({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Fetch current subscription
    return {
      tier: 'RECRUIT',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
  }),

  getTiers: protectedProcedure.query(async () => {
    return [
      {
        id: 'RECRUIT',
        name: 'RECRUIT',
        price: 97,
        features: {
          maxAgents: 1,
          maxConnectors: 3,
          maxModels: 2,
          monthlyRunLimit: 500,
        },
      },
      {
        id: 'OPERATOR',
        name: 'OPERATOR',
        price: 497,
        features: {
          maxAgents: 5,
          maxConnectors: 10,
          maxModels: 5,
          monthlyRunLimit: 5000,
        },
      },
      {
        id: 'EMPIRE',
        name: 'EMPIRE',
        price: 2497,
        features: {
          maxAgents: -1,
          maxConnectors: -1,
          maxModels: -1,
          monthlyRunLimit: -1,
        },
      },
    ];
  }),

  createCheckoutSession: protectedProcedure
    .input(z.object({ tier: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Create Stripe checkout session
      return { url: '#' };
    }),
});

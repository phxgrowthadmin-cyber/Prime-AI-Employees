import { initTRPC, TRPCError } from '@trpc/server';
import { auth } from '@clerk/nextjs/server';

type Context = {
  userId: string | null;
  orgId: string | null;
};

export const createContext = async (): Promise<Context> => {
  const { userId, orgId } = await auth();
  return {
    userId: userId || null,
    orgId: orgId || null,
  };
};

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId || !ctx.orgId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      userId: ctx.userId,
      orgId: ctx.orgId,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

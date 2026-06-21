import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'nexus-ai',
  apiKey: process.env.INNGEST_API_KEY,
  eventKey: process.env.INNGEST_EVENT_KEY,
});

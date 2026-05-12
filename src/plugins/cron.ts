import fp from 'fastify-plugin';
import { Cron } from 'croner';

export default fp(async (app) => {
  const jobs: Cron[] = [];

  jobs.push(
    new Cron('0 * * * *', { name: 'hourly-heartbeat' }, () => {
      app.log.info('cron: heartbeat horário');
    }),
  );

  app.addHook('onClose', async () => {
    jobs.forEach((j) => j.stop());
  });
});
import pino from 'pino';

const pinoLogger = pino({
  transport: {
    pipeline: [
      { target: './transform.prod.js' },
      {
        target: 'pino/file',
        options: { destination: 1 },
      },
    ],
  },
});

export { pinoLogger };

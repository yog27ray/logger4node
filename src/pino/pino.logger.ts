import pino from 'pino';

const pinoLogger = pino({
  transport: {
    pipeline: [
      { target: './pino.transform.js' },
      {
        target: 'pino/file',
        options: { destination: 1 },
      },
    ],
  },
});

export { pinoLogger };

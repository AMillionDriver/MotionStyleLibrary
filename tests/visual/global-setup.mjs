import { startStaticServer } from '../../scripts/serve-static.mjs';

export default async function globalSetup() {
  const server = await startStaticServer({ port: 4174, quiet: true });

  return async () =>
    new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
}

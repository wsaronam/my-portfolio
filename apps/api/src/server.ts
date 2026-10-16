import { buildApp } from "./app.js";
import { loadConfig } from "./config.js";




const config = loadConfig();
const app = buildApp(config);


async function shutdown(signal: NodeJS.Signals): Promise<void> {
    app.log.info({ signal }, 'Shutting down');
    await app.close();
    process.exit(0);
}


process.once('SIGINT', (signal) => void shutdown(signal));
process.once('SIGTERM', (signal) => void shutdown(signal));


try {
    await app.listen({ host: config.HOST, port: config.PORT });
}
catch (err) {
    app.log.error(err, 'Failed to start server');
    process.exit(1);
}
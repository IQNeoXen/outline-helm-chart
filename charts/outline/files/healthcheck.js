const net = require('net');

// Configuration with environment variable defaults
const config = {
  postgresHost: process.env.PGHOST || 'postgres',
  postgresPort: parseInt(process.env.PGPORT || '5432'),
  redisHost: process.env.REDIS_HOST || 'redis',
  redisPort: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetries: parseInt(process.env.MAX_RETRIES || '30'),
  retryInterval: parseInt(process.env.RETRY_INTERVAL || '2') * 1000,
};

// Function to check if a service is available
function checkService(host, port, serviceName) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    let timer;

    socket.on('connect', () => {
      clearTimeout(timer);
      socket.end();
      console.log(`Successfully connected to ${serviceName} at ${host}:${port}`);
      resolve(true);
    });

    socket.on('error', (err) => {
      clearTimeout(timer);
      socket.destroy();
      console.log(`Failed to connect to ${serviceName} at ${host}:${port}: ${err.message}`);
      resolve(false);
    });

    timer = setTimeout(() => {
      socket.destroy();
      console.log(`Connection to ${serviceName} at ${host}:${port} timed out`);
      resolve(false);
    }, 3000);

    socket.connect(port, host);
  });
}

async function main() {
  console.log("Starting database initialization checks...");
  console.log(`Checking PostgreSQL at ${config.postgresHost}:${config.postgresPort}`);
  console.log(`Checking Redis at ${config.redisHost}:${config.redisPort}`);

  let retryCount = 0;
  let pgReady = false;
  let redisReady = false;

  while (retryCount < config.maxRetries) {
    if (!pgReady) {
      pgReady = await checkService(config.postgresHost, config.postgresPort, 'PostgreSQL');
    }

    if (!redisReady) {
      redisReady = await checkService(config.redisHost, config.redisPort, 'Redis');
    }

    if (pgReady && redisReady) {
      console.log('All services are ready!');
      break;
    }

    retryCount++;
    if (retryCount < config.maxRetries) {
      console.log(`Retry ${retryCount}/${config.maxRetries} - waiting ${config.retryInterval/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, config.retryInterval));
    }
  }

  if (!pgReady || !redisReady) {
    console.error(`Failed to connect to services after ${config.maxRetries} attempts.`);
    process.exit(1);
  }

  // Run migrations when both services are ready
  console.log("All dependencies are ready!");
}

main();

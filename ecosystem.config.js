module.exports = {
  apps: [
    {
      name: 'winx',
      command: 'pnpm start:dev',
      restart: true,
      cron_restart: '0 */3 * * *', // Every 3 hours
    },
  ],
}

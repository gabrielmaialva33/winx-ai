module.exports = {
  apps: [
    {
      name: 'winx',
      command: 'pnpm run build && pnpm run start',
      restart: true,
      cron_restart: '0 */3 * * *', // Every 3 hours
    },
  ],
}

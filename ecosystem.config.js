module.exports = {
  apps: [
    {
      name: 'winx',
      command: './node_modules/.bin/rimraf dist && npm run build && npm run start',
      restart: true,
      cron_restart: '0 */1 * * *',
    },
  ],
}

module.exports = {
  apps: [
    {
      name: 'winx',
      command: 'npm run build && npm run start',
      restart: true,
    },
  ],
}

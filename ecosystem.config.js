module.exports = {
  apps: [
    {
      name: 'winx',
      command: 'rimraf dist && npm run build && npm run start',
      restart: true,
    },
  ],
}

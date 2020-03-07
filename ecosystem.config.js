module.exports = {
  apps: [
    {
      name: 'Netabare Front',
      script: 'server.js',
      args: '',
      instances: 1,
      autorestart: true,
      exec_mode: 'fork',
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
    },
  ],
};

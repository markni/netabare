module.exports = {
  apps: [
    {
      name: 'Netabare Front',
      script: 'npm',
      args: 'run server:start',
      instances: 1,
      autorestart: true,
      exec_mode: 'fork',
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      interpreter: '/root/.nvm/versions/node/v20.12.2/bin/node'
    }
  ]
}

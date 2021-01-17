module.exports = {
  apps: [
    {
      name: "server",
      script: "node server.js",
      cwd: "./",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      increment_var: "WORKER_NAME",
      env: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};

#!/bin/sh
set -e

if [ -n "$DB_HOST" ]; then
  echo "Generating config from environment variables..."
  mkdir -p /etc/mywebapp
  cat > /etc/mywebapp/config.json << EOF
{
  "server": {
    "host": "${APP_HOST:-0.0.0.0}",
    "port": ${APP_PORT:-8080}
  },
  "database": {
    "host": "${DB_HOST}",
    "port": ${DB_PORT:-5432},
    "user": "${DB_USER}",
    "password": "${DB_PASSWORD}",
    "database": "${DB_NAME}"
  }
}
EOF
fi

echo "Running database migration..."
node /opt/mywebapp/migration.js

echo "Starting web server..."
exec node /opt/mywebapp/server.js
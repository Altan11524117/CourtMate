#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
until nc -z $DB_HOST $DB_PORT; do
  echo "Database is unavailable - sleeping"
  sleep 1
done
echo "Database is ready!"

# Wait for Redis to be ready (optional)
if [ ! -z "$REDIS_HOST" ]; then
  echo "Waiting for Redis to be ready..."
  until nc -z $REDIS_HOST $REDIS_PORT; do
    echo "Redis is unavailable - sleeping"
    sleep 1
  done
  echo "Redis is ready!"
fi

# Wait for RabbitMQ to be ready (optional)
if [ ! -z "$RABBITMQ_HOST" ]; then
  echo "Waiting for RabbitMQ to be ready..."
  until nc -z $RABBITMQ_HOST $RABBITMQ_PORT; do
    echo "RabbitMQ is unavailable - sleeping"
    sleep 1
  done
  echo "RabbitMQ is ready!"
fi

# Start the application
echo "Starting CourtMate backend..."
exec "$@"

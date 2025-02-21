#!/bin/bash

# Construct the JSON string with host, port, username, and password from environment variables
JSON=$(printf '{"host":"%s","port":%d,"username":"%s","password":"%s"}' \
  "$REDIS_HOST" "$REDIS_PORT" "$REDIS_USERNAME" "$REDIS_PASSWORD")

# Base64-encode the JSON string
BASE64_JSON=$(echo -n "$JSON" | base64)

# Set the REDIS_URL environment variable
export REDIS_URL="ioredis://$BASE64_JSON"

# Execute the original command (yarn start)
exec yarn start

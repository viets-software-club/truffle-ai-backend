#!/bin/bash
# exports environment variables based on NODE_ENV
if [ "$NODE_ENV" != "production" ] && [ "$NODE_ENV" != "test" ] && [ "$NODE_ENV" != "build" ]
then
echo '[env.sh] Using .env.dev environment variables'
export $(cat ../../.env.dev | grep -v \"#\" | xargs)
else
echo '[env.sh] Did not load environment variables'
fi
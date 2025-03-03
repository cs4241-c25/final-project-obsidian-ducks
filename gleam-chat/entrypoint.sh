#!/bin/sh

# Expand ERL_AFLAGS environment variable to include runtime variables
export ERL_AFLAGS=-proto_dist inet6_tcp -name ${FLY_APP_NAME}-${FLY_IMAGE_REF##*-}@${FLY_PRIVATE_IP} -setcookie "$ERLANG_COOKIE"
echo $ERL_AFLAGS

exec $@

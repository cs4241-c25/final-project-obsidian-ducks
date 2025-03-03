#!/bin/sh

# Expand ERL_AFLAGS environment variable to include runtime variables
export ERL_AFLAGS=-proto_dist inet6_tcp -name ${FLY_APP_NAME}-${FLY_IMAGE_REF##*-}@${FLY_PRIVATE_IP} -setcookie "$ERLANG_COOKIE"
echo $ERL_AFLAGS

exec $@


# fdaa:d:dd4a:a7b:e:9fc4:15b4:2
# fdaa:d:dd4a:a7b:e:9fc4:15b4:2
# fdaa:d:dd4a:a7b:95:8ba1:e979:2

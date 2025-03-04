#!/bin/sh

# Expand ERL_AFLAGS environment variable to include runtime variables
export ERL_AFLAGS=$(eval echo "$ERL_AFLAGS")
echo $ERL_AFLAGS

exec $@


# fdaa:d:dd4a:a7b:e:9fc4:15b4:2
# fdaa:d:dd4a:a7b:e:9fc4:15b4:2
# fdaa:d:dd4a:a7b:95:8ba1:e979:2

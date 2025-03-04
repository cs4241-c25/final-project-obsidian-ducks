FROM debian as cloner

RUN apt-get install -y git

FROM ghcr.io/gleam-lang/gleam:v1.8.1-erlang-alpine

# Add project code
COPY . /build/

# Compile the project
RUN cd /build/chat_server \
  && gleam export erlang-shipment \
  && mv build/erlang-shipment /app \
  && mv env_setter.sh /app \
    && rm -r /build


# Run the server
EXPOSE 3001
WORKDIR /app
RUN chmod +x /app/env_setter.sh
ENTRYPOINT ["/app/env_setter.sh", "/app/entrypoint.sh"]
CMD ["run"]

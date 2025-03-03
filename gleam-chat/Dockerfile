FROM debian as cloner

RUN apt-get install -y git

FROM ghcr.io/gleam-lang/gleam:v1.8.1-erlang-alpine

# Add project code
COPY . /build/

# Compile the project
RUN cd /build/chat_server \
  && gleam export erlang-shipment \
  && mv build/entrypoint.sh /app \
    && mv build/erlang-shipment /app \
  && rm -r /build


# Run the server
EXPOSE 3001
WORKDIR /app
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["run"]

FROM nginx:1.17-alpine

RUN rm -rf /usr/share/nginx/html/*
WORKDIR /usr/share/nginx/html

RUN mkdir -p assets/json

EXPOSE 80

COPY config/config.default.json /default-config/config.json
COPY dist .

CMD ["/bin/sh",  "-c",  "\
if [ -e /config/config.json ]; \
then ln -s -f /config/config.json assets/json/config.json; \
else ln -s -f /default-config/config.json assets/json/config.json; \
fi; \
exec nginx -g 'daemon off;'"]

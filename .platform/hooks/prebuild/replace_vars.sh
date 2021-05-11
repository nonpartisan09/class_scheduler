#!/bin/bash
sed -i -r '/^[ \t]*ssl_certificate(_key)? /s/\$ssl_server_name/'"$DOMAIN_NAME"/ .platform/nginx/conf.d/https.conf
sed -i -r '/@RACK_ENV@/s//'"$RACK_ENV"/ .platform/nginx/conf.d/https.conf .platform/nginx/conf.d/elasticbeanstalk/http.conf

#!/bin/bash
set -e -u

mkdir -p /var/www/certbot
# fails when already installed: https://github.com/rpm-software-management/yum/issues/90
yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm ||:
yum-config-manager --enable epel\*
yum install -y certbot
certbot certificates --debug -n --agree-tos
systemctl daemon-reload
systemctl enable certbot-renew.timer
systemctl start certbot-renew.timer

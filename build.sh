#!/bin/bash
production_mode=0

if [ $ENV = 'PRO' ]
then
  production_mode=1
fi

if [ $production_mode -eq 0 ]
then
  ENV=$ENV enpm run build --page all --exclude-dir demo
else
  NODE_ENV=production ENV=$ENV enpm run build --page all --exclude-dir demo --throw-page-build-error --disable-js-entry-missing-error-inject
fi
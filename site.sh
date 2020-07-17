#!/bin/bash
if [[ $1 == "build" ]];
then
  echo "Building site"
  rm -fv "pages/content/dist/*latest*"
  docker run --rm -it \
    -v $(pwd)/pages:/src \
    -u hugo jguyomard/hugo-builder:0.55-extras hugo
else
  echo "Starting hugo server"
  docker run --rm -it \
    -v $(pwd)/pages:/src \
    -p 1313:1313 \
    -u hugo jguyomard/hugo-builder:0.55-extras hugo server -w --bind=0.0.0.0
fi

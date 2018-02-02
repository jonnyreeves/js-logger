#!/usr/bin/env sh

docker run -it --rm --name my-running-script -v "$PWD":/usr/src/app -w /usr/src/app node:8.9.4 test-typescript/test-package.sh
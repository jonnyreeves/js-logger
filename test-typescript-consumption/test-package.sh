#!/usr/bin/env sh
set -eu

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"

cd $SCRIPT_DIR/..
yarn pack --filename js-logger-test-package.tar.gz
cd $SCRIPT_DIR

rm -rf yarn.lock node_modules
yarn install
yarn add ../js-logger-test-package.tar.gz

yarn run tsc

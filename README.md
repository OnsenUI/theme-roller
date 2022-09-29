# theme-roller

> Onsen UI Theme Roller

## Node/NPM Version

``` bash
Node: 8.17.0
NPM: 6.13.4
```

## Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn run dev

# build for production with minification
yarn run build

# build for production and view the bundle analyzer report
yarn run build --report

# run unit tests
yarn run unit

# run e2e tests
yarn run e2e

# run all tests
yarn test
```

## Release
The `gh-pages` branch is used to serve on production, pulled in automatically to the `onsen.io` build process. To build into this branch, run from `master`:

```
yarn run deploy
```
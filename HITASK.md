# Integration guide of Blueprint library to Hitask projects

This repository is a fork of [original Blueprint project](https://github.com/palantir/blueprint), made for customization purpose.

Add Upstream:

```
git remote add upstream git@github.com:palantir/blueprint.git
git fetch upstream
```

## Update

Merge blueprint's updates from upstream regularly. Merge them to `custom` branch

## Customize

Develop needed overrides and customizations locally, using blueprint's development scripts (read [README.md](README.md) for more info). Merge changes to `custom` branch

```
yarn
yarn compile
yarn dist:libs
yarn dist:apps
yarn dev:core
```

## Test

To test changes in projects of [hitask-web](https://gitlab.com/hitask/hitask-web) repo, run following scripts. For correct work, blueprint and hitask-web repos must be in the same folder, on the same level

* `yarn compile && yarn dist:libs` - Compile libs distributions from custom branch
* `git checkout custom-publish` - publish branch has package.json required overrides
* `./scripts/hitask-web-link` - Copy libs to hitask-web/node_modules

## Publish

When changes are ready to be published, do:

* run `yarn verify` - Compile and test libs. Continue only after successful complete
* Merge `custom` branch to `custom-publish` branch
* Update packages versions
* From each package folder run `npm publish --access=public`
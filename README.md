# get-better

To run your project, navigate to the directory and run one of the following npm commands.

Scripts:
`yarn start` - runs expo start (develop env)
`yarn start:prod` - ... (prod env)
`yarn lint` - runs eslint
`yarn test` - runs jest test suite TODO
`yarn nuke` - delete node_modules, yarn.lock, package-lock.json if exists

Infra Versions:

- Node -> v18.16.0
- yarn -> 1.22.10

Environments:

- develop - (curr main) base branch for feature work
`yarn start:dev`
- staging - pre production env for validation & final testing
- production - deployed to app store

Lint and Test:

- yarn lint

## Pipelines

Github Actions CICD YAML configs set in `.github/workflows` dir

## Setup Build & Deploy

download the following keys from Apple Developer account (`Users and Access`-> `keys`):

- expo_build_key

## Styling & organization (TS)

#### Component

View Controller component model. View component is the dummy logic that paints the UI. Controller implements the business logic (hooks, computation, etc)
This improves reuse/test-ability and clarity

#### Files

styles, types, hooks, controller, and view should be split into separate w/ appropriate extensions

- jest unit test files -> `.test`
- types -> `.types.ts`
- styles -> `.styles.ts`
- Connected component should be prepended w/ Connected but internal component exported without. `TestComponent.tsx -> ConnectedTestComponent.tsx`

#### Style & Formatting

directory name is `kebab-case`, Tsx `PascalCase`

#### Unit Testing

- [ ] TODO: Goal Functional coverage 90%
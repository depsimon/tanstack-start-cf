# Tanstack Start Cloudflare

This site is built with TanStack Start!

- [TanStack Start Docs](https://tanstack.com/start)

This template uses the following tools:

- [Bun](https://bun.sh/docs) as the package manager
- [Biome](https://biomejs.dev/) as the linter & formatter
- [Lefthook](https://lefthook.dev/) as the git hooks manager
- [Tailwind CSS](https://tailwindcss.com/) as the CSS framework

We use [Alchemy](https://alchemy.run/) to be orchestrate the deployment on Cloudflare with a KV & a D1 Database ready to be used.


> [!TIP]
Looking for a simpler template? Checkout the [Start Basic template](https://github.com/depsimon/tanstack-basic).

## Installation

To setup a project from this template, the simplest way is to use gitpick:

```sh
git clone https://github.com/depsimon/tanstack-start-cf.git my-app
cd my-app
bun install
bun run deploy # Initial deployment of resources, required to use the bindings locally
bun db:migrate # Apply migrations locally
```

## Development

From your terminal:

```sh
bun dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

When you're ready to deploy, you can run:

```sh
bun run deploy
```

By default, this will deploy a dev version of your app.
If you want to deploy a different version, the deployment accepts a `STAGE` env that you can use to deploy any branch/environment.

```sh
bun run deploy # Will deploy resources in a `dev` namespace
STAGE=prod bun run deploy # Will deploy resources in a `prod` namespace
STAGE=staging bun run deploy # Will deploy resources in a `staging` namespace
```

## Move the state to Cloudflare

By default the state of your resources is stored in the file system of your project.

You can change that by using another state storage like Durable Objects.

You can easily do that by adding a few env variables or by copying the `.env.example` to `.env` and adapting the values.

[Read the documentation](https://alchemy.run/docs/concepts/state.html#durable-objects-state-store-recommended)

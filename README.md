# ikomida-shared-frontend

Shared UI primitives and client-side infrastructure.

> Part of the **iKomida** platform. See **[ikomida-k8s-config](https://github.com/kaitbellahs/ikomida-k8s-config)** for the architecture overview of all 31 repositories.

---

## Role

Consumed by the four applications. Provides the HTTP client with token handling and refresh, client-side image resizing before upload, and the components repeated across every front end — so the apps differ in what they do, not in how they talk to the API.

## Stack

TypeScript · rollup · API Extractor · published as a versioned npm package

## Build

```bash
yarn install
yarn build
yarn build:types   # API Extractor rollup of .d.ts
```

## Status

Built in 2022. The platform is no longer deployed; this repository is published as a record of the work. **The commit history predates generative AI coding assistants.**

## License

Licensed under the [Apache License 2.0](LICENSE) — free for commercial use, provided the copyright notice and [NOTICE](NOTICE) are retained.

Copyright 2022 Khalid Ait Bellahs.

# [1.4.0](https://github.com/arthurGuillemin/pinball_backend/compare/v1.3.0...v1.4.0) (2026-04-21)


### Bug Fixes

* **format:** run prettier with --write ([f53d778](https://github.com/arthurGuillemin/pinball_backend/commit/f53d778aa66645db85bd65ee87dae4cbf46f2728))


### Features

* **communication:** improve game state management && web sockets ([f205700](https://github.com/arthurGuillemin/pinball_backend/commit/f205700401ca71bcc92c00dd4be377899fcd286d))

# [1.3.0](https://github.com/arthurGuillemin/pinball_backend/compare/v1.2.1...v1.3.0) (2026-04-20)

### Bug Fixes

- **bridge:** Remove commented error logging in MQTT client ([743d730](https://github.com/arthurGuillemin/pinball_backend/commit/743d7302e953d0e5120cf92556ae5c755ca0192d))
- **ci:** remove build from ci ([3f85341](https://github.com/arthurGuillemin/pinball_backend/commit/3f853411628059ef9d909bcdc9ef4a9d2f1102ca))
- **ci:** remove matrix and fix Node.js version to 22 for tests ([0ffcf48](https://github.com/arthurGuillemin/pinball_backend/commit/0ffcf482f6d817de1808766e9f4a84eec27ba927))

### Features

- **ci:** add eslint and prettier configuration ([231bcc2](https://github.com/arthurGuillemin/pinball_backend/commit/231bcc2869c2a2ce434782888cf92caabbc827d1))
- **format:** format codebase with prettier ([29c33c1](https://github.com/arthurGuillemin/pinball_backend/commit/29c33c1bdef4f25471e33cc69de5259c3a6370fd))

## [1.2.1](https://github.com/arthurGuillemin/pinball_backend/compare/v1.2.0...v1.2.1) (2026-04-03)

### Bug Fixes

- **cdProduction:** fix docker image version ([b386268](https://github.com/arthurGuillemin/pinball_backend/commit/b386268740955e99d6555ade9c31fcb2e77e6d92))

# [1.2.0](https://github.com/arthurGuillemin/pinball_backend/compare/v1.1.5...v1.2.0) (2026-04-03)

### Features

- **health:** add /health endpoint with Supabase check ([dee3e52](https://github.com/arthurGuillemin/pinball_backend/commit/dee3e52ee56be2ae88d44f6004a30e7749d20c7e))
- **healthh:** implement health endpoint ([583eb84](https://github.com/arthurGuillemin/pinball_backend/commit/583eb844515bccbff03c0036ef370bc7335a0709))

## [1.1.5](https://github.com/arthurGuillemin/pinball_backend/compare/v1.1.4...v1.1.5) (2026-04-03)

### Bug Fixes

- **ci:** changetrivy exit code to 0 ([eb86f7d](https://github.com/arthurGuillemin/pinball_backend/commit/eb86f7d8b9786a93dea4fd4fbc95f048ab65183e))

## [1.1.4](https://github.com/arthurGuillemin/pinball_backend/compare/v1.1.3...v1.1.4) (2026-04-03)

### Bug Fixes

- **ci:** rempove wrong node version syntax ([f86edd8](https://github.com/arthurGuillemin/pinball_backend/commit/f86edd826a7b20ed5e7208b86829a3fe7e2f40ff))
- **ci:** tag latest to docker image and syntax correction node version in yml ([de0035f](https://github.com/arthurGuillemin/pinball_backend/commit/de0035fdb607007bab3c8e74a56af2da218924b6))

## [1.1.3](https://github.com/arthurGuillemin/pinball_backend/compare/v1.1.2...v1.1.3) (2026-04-03)

### Bug Fixes

- **ci:** change node version in dockerfile , remove arm build and add omit=dev to npm ci jobs ([d4b311e](https://github.com/arthurGuillemin/pinball_backend/commit/d4b311e9311c8355ec726042a9415008bddf1e5c))
- **ci:** rempove wrong omit dev ([03f99f6](https://github.com/arthurGuillemin/pinball_backend/commit/03f99f636f35ae25d703ba6dfe467e1519c125ba))
- **ci:** rempove wrong omit dev ([437113a](https://github.com/arthurGuillemin/pinball_backend/commit/437113a93ece1c57a3ccbdcfbc95cd51da7a2235))

## [1.1.2](https://github.com/arthurGuillemin/pinball_backend/compare/v1.1.1...v1.1.2) (2026-04-03)

### Bug Fixes

- **ci:** change branche ref to main ([e2da095](https://github.com/arthurGuillemin/pinball_backend/commit/e2da0952d520b5068209e14296723bd87a64d2a6))

## [1.1.1](https://github.com/arthurGuillemin/pinball_backend/compare/v1.1.0...v1.1.1) (2026-04-03)

### Bug Fixes

- **ci:** condition to upload trivy result scan ([815a3b4](https://github.com/arthurGuillemin/pinball_backend/commit/815a3b40609eac5a77c802dcb20006aeabe3c634))

# [1.1.0](https://github.com/arthurGuillemin/pinball_backend/compare/v1.0.0...v1.1.0) (2026-04-03)

### Bug Fixes

- **ci:** hide discord webhook link in gh secret ([af48015](https://github.com/arthurGuillemin/pinball_backend/commit/af4801586778ff0764f98b6b437d52d676a35a2d))
- **ci:** improve CI pipeline for tests and build ([985fbb0](https://github.com/arthurGuillemin/pinball_backend/commit/985fbb0e62403c2c2af455ba19a19d63fdc3dee5))

### Features

- **changelog:** update changelog ([e0676b0](https://github.com/arthurGuillemin/pinball_backend/commit/e0676b08d2eb112e8aaef236c859e1887effe938))

# 1.0.0 (2026-04-02)

### Bug Fixes

- **api:** improve error handling and validation flow ([ca6d754](https://github.com/arthurGuillemin/pinball_backend/commit/ca6d754c9c616e9ae59579cc2d809cfe35640adf))
- **cd,ci:** update node version to a more recent one ([71e6c15](https://github.com/arthurGuillemin/pinball_backend/commit/71e6c1567a2d138b90bb54cde6c17720ddedd8a3))

- **ci:** add missing dependencies for auto release ([9c5bceb](https://github.com/arthurGuillemin/pinball_backend/commit/9c5bceb86f53f4305719113c0af8692a3f6a3f00))
- **ci:** change github token name ([d8800e2](https://github.com/arthurGuillemin/pinball_backend/commit/d8800e2c866065de1718ecc829041dcdbcf1c061))

### Features

- add CORS restriction and Zod validation on score POST route ([3cc3921](https://github.com/arthurGuillemin/pinball_backend/commit/3cc3921c82cfec6ffda3aae87f3456df6423ba52))
- add game state manager ([6defc8f](https://github.com/arthurGuillemin/pinball_backend/commit/6defc8f6bb18190b07db7bc1f64eb411945c90e5))
- **ci:** add semantic release and commitlint ([6e1376e](https://github.com/arthurGuillemin/pinball_backend/commit/6e1376e37fab1e3ac47ad10346e387aba1a54289))

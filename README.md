# typed-environment-loader

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[![NPM](https://nodei.co/npm/typed-environment-loader.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/typed-environment-loader/)

typed-environment-loader is a lightweight utility for loading environment variables in a typed manner, ensuring type safety and consistency in your Node.js applications.

## Installation

You can install typed-environment-loader via npm:

```bash
npm install typed-environment-loader
```

## Usage

```typescript

import * as dotenv from 'dotenv';
import {  EnvironmentLoader, NestedSchema } from 'typed-environment-loader';

const schema = {
 port: { type: 'number', default: 3000, required: true, name: 'PORT' },
 nodeEnv: {
  type: 'enum',
  values: ['production', 'development', 'test'],
  default: 'development',
  required: true,
  name: 'NODE_ENV'
 },
 postgres: {
  host: { type: 'string', default: 'localhost', required: true, name: 'POSTGRES_HOST' },
  password: { type: 'string', required: true, name: 'POSTGRES_PASSWORD' },
  port: { type: 'number', default: 5432, required: true, name: 'POSTGRES_PORT' }
 },
 cors: {
  enabled: { type: 'boolean', default: true, required: true, name: 'CORS_ENABLED' },
  origins: { type: 'array', items: { type: 'string' }, default: ['*'], required: true, name: 'CORS_ORIGINS' }
 },
 matrix: {
  type: 'array',
  items: { type: 'array', items: { type: 'number' } },
  required: false,
  name: 'MATRIX',
  default: [[1, 2], [3, 4]]
 },
 redis: {
  host: { type: 'string', default: 'localhost', required: true, name: 'REDIS_HOST' },
  port: { type: 'number', default: 6379, required: true, name: 'REDIS_PORT' },
  password: { type: 'string', required: false, name: 'REDIS_PASSWORD' }
 },
 api: {
  baseUrl: { type: 'string', default: 'http://localhost:3000', required: true, name: 'API_BASE_URL' },
  timeout: { type: 'number', default: 5000, required: true, name: 'API_TIMEOUT' }
 },
 services: {
  auth: {
   url: { type: 'string', default: 'http://localhost:4000', required: true, name: 'AUTH_URL' },
   timeout: { type: 'number', default: 3000, required: true, name: 'AUTH_TIMEOUT' }
  },
  payment: {
   url: { type: 'string', default: 'http://localhost:5000', required: true, name: 'PAYMENT_URL' },
   timeout: { type: 'number', default: 4000, required: true, name: 'PAYMENT_TIMEOUT' }
  }
 }
} satisfies NestedSchema;

const loadedEnv = dotenv.config({});
if (loadedEnv.error) {
    throw new Error(
    `Error loading environment variables from.env file it must be located in the root of the project.`
    );
}

const loader = new EnvironmentLoader(schema);
const configObject = loader.load();
console.log(configObject);
```

## Why typed-environment-loader?

typed-environment-loader provides a simple and intuitive way to load environment variables in your Node.js applications while ensuring type safety and consistency. Here's why you should choose it:

- **Declarative Style**: typed-environment-loader uses a declarative style for defining environment variable configurations. This allows you to specify the structure of your environment variables in a clear and concise manner, making it easy to understand and maintain.

- **Type Safety**: With typed-environment-loader, you can specify the types of your environment variables, ensuring that your application receives the correct data types. This helps prevent runtime errors and enhances code reliability.

- **Consistency**: By defining your environment variable structure in one place, you maintain consistency across your application's configuration. This reduces the risk of configuration errors and makes it easier to manage and scale your application.

- **Ease of Use**: typed-environment-loader offers a clean and straightforward API for loading environment variables, making it easy to integrate into your projects. Whether you're working on a small project or a large-scale application, typed-environment-loader provides a hassle-free solution for managing your environment configurations.

## Issues

We welcome any contributions or feedback! If you encounter any bugs, have feature requests, or want to ask questions, please don't hesitate to create an issue. We also have specific issue templates to help guide you in providing the necessary information.

### Issue Templates

For your convenience, we have provided issue templates to cover common types of contributions. You can find them in the [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/) directory:

- **Bug Report**: Use this template if you've encountered a bug or unexpected behavior in the library.
- **Feature Request**: Use this template to propose a new feature or enhancement.
- **Question / Help Wanted**: Use this template if you have questions or need help with using the library.

Please make sure to fill out all the sections in the template relevant to your issue. This will help us understand your request better and address it promptly.

### Contributing

If you'd like to contribute code, please refer to the [Contributing Guidelines](CONTRIBUTING.md) for instructions on how to contribute. We appreciate your help in improving typed-environment-loader!

## License

typed-environment-loader is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).

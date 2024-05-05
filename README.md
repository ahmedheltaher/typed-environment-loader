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
import { Configuration, EnvironmentLoader, ParsedConfig } from 'typed-environment-loader';

// Define your configuration
const config: Configuration = {
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
 }
};

// Define the expected parsed config interface
interface Config extends ParsedConfig {
 port: number;
 nodeEnv: 'production' | 'development' | 'test';
 postgres: {
  host: string;
  password: string;
  port: number;
 };
}

// Create a loader instance with the configuration
const loader = new EnvironmentLoader<Config>(config);

// Load environment variables from .env file
loader.loadFromFile();

// Load environment variables and parse them
const configObject = loader.load();

console.log(configObject);
```

## Why typed-environment-loader?

typed-environment-loader provides a simple and intuitive way to load environment variables in your Node.js applications while ensuring type safety and consistency. Here's why you should choose it:

- **Declarative Style**: typed-environment-loader uses a declarative style for defining environment variable configurations. This allows you to specify the structure of your environment variables in a clear and concise manner, making it easy to understand and maintain.

- **Type Safety**: With typed-environment-loader, you can specify the types of your environment variables, ensuring that your application receives the correct data types. This helps prevent runtime errors and enhances code reliability.

- **Consistency**: By defining your environment variable structure in one place, you maintain consistency across your application's configuration. This reduces the risk of configuration errors and makes it easier to manage and scale your application.

- **Ease of Use**: typed-environment-loader offers a clean and straightforward API for loading environment variables, making it easy to integrate into your projects. Whether you're working on a small project or a large-scale application, typed-environment-loader provides a hassle-free solution for managing your environment configurations.

## License

typed-environment-loader is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).

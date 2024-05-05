import { Configuration, EnvironmentLoader, ParsedConfig } from '../src';

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

interface Config extends ParsedConfig {
	port: number;
	nodeEnv: 'production' | 'development' | 'test';
	postgres: {
		host: string;
		password: string;
		port: number;
	};
}

const loader = new EnvironmentLoader<Config>(config);
const configObject = loader.loadFromFile().load();

// eslint-disable-next-line no-console
console.log(configObject);

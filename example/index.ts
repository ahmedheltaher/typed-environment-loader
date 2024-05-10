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
	},
	cors: {
		enabled: { type: 'boolean', default: true, required: true, name: 'CORS_ENABLED' },
		origins: { type: 'array', items: { type: 'string' }, default: ['*'], required: true, name: 'CORS_ORIGINS' }
	},
	matrix: {
		type: 'array',
		items: { type: 'array', items: { type: 'number' } },
		required: false,
		name: 'MATRIX'
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
	cors: {
		enabled: boolean;
		origins: Array<string>;
	};
	matrix: Array<Array<number>>;
}

const loader = new EnvironmentLoader<Config>(config);
const configObject = loader.loadFromFile().load();

// eslint-disable-next-line no-console
console.log(configObject);

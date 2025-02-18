import { EnvironmentLoader, EnvironmentSchema } from '../src';

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
		default: [
			[1, 2],
			[3, 4]
		]
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
} satisfies EnvironmentSchema;

process.env = {
	...process.env,
	PORT: '3000',
	NODE_ENV: 'development',
	POSTGRES_HOST: 'localhost',
	POSTGRES_PASSWORD: '<PASSWORD>',
	POSTGRES_PORT: '5432',
	CORS_ENABLED: 'true',
	CORS_ORIGINS: '["*"]',
	MATRIX: `[["1", "2"], ["3", "4"]]`,
	REDIS_HOST: 'localhost',
	REDIS_PORT: '6379',
	REDIS_PASSWORD: '<REDIS_PASSWORD>',
	API_BASE_URL: 'http://localhost:3000',
	API_TIMEOUT: '5000',
	AUTH_URL: 'http://localhost:4000',
	AUTH_TIMEOUT: '3000',
	PAYMENT_URL: 'http://localhost:5000',
	PAYMENT_TIMEOUT: '4000'
};

const loader = new EnvironmentLoader(schema);
const configObject = loader.load();

// eslint-disable-next-line no-console
console.log(configObject);

import { EnumValues } from './types';

export interface Parsers {
	stringParser(value: string, name: string): string;
	numberParser(value: string, name: string): number;
	booleanParser(value: string, name: string): boolean;
	enumParser(value: string, values: EnumValues, name: string): string;
}

export const parsers: Parsers = {
	stringParser(value: string): string {
		return value;
	},

	numberParser(value: string, name: string): number {
		const parsedValue = parseInt(value, 10);
		if (isNaN(parsedValue)) {
			throw new Error(`Invalid value for ${name}: ${value}`);
		}
		return parsedValue;
	},

	booleanParser(value: string, name: string): boolean {
		if (value !== 'true' && value !== 'false') {
			throw new Error(`Invalid value for ${name}: ${value}`);
		}
		return value === 'true';
	},

	enumParser(value: string, values: EnumValues, name: string): string {
		if (!values.includes(value)) {
			throw new Error(`Invalid value for ${name}: ${value}`);
		}
		return value;
	}
};

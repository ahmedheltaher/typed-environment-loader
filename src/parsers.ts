import { ArrayItem, EnumValues } from './types';

export interface Parsers {
	string(value: string, name: string): string;
	number(value: string, name: string): number;
	boolean(value: string, name: string): boolean;
	enum(value: string, values: EnumValues, name: string): string;
	array(value: string, items: ArrayItem<any>, name: string): any[];
}

export const parsers: Parsers = {
	string(value: string): string {
		return value;
	},

	number(value: string, name: string): number {
		const parsedValue = parseInt(value, 10);
		if (isNaN(parsedValue)) {
			throw new Error(`Invalid value for ${name}: ${value}`);
		}
		return parsedValue;
	},

	boolean(value: string, name: string): boolean {
		if (value !== 'true' && value !== 'false') {
			throw new Error(`Invalid value for ${name}: ${value}`);
		}
		return value === 'true';
	},

	enum(value: string, values: EnumValues, name: string): string {
		if (!values.includes(value)) {
			throw new Error(`Invalid value for ${name}: ${value}`);
		}
		return value;
	},

	array(value: string, items: ArrayItem<any>, name: string): any[] {
		if (value === '') return [];
		if (!value.startsWith('[') || !value.endsWith(']')) {
			throw new Error(`Invalid value for ${name}: ${value}, must be a JSON array`);
		}
		try {
			const arrayValue = JSON.parse(value);
			if (!Array.isArray(arrayValue)) {
				throw new Error(`Invalid value for ${name}: ${value}, must be a JSON array`);
			}
			return items.type === 'array'
				? arrayValue.map((item: any) => this.array(JSON.stringify(item), items.items, name))
				: arrayValue.map((item: any) => this[items.type](item, name));
		} catch (error) {
			throw new Error(`Invalid value for ${name}: ${value}, must be a JSON array`);
		}
	}
};

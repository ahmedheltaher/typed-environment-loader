export type EnumSchema<Type extends readonly string[]> = {
	type: 'enum';
	name?: string;
	values: Type;
	default?: Type[number];
	required?: boolean;
};

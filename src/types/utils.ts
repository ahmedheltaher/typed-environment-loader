export type ValidatorFunction<Type> = (value: Type) => boolean;
export type Validator<Type> =
	| ValidatorFunction<Type>
	| {
			function: ValidatorFunction<Type>;
			message: string;
			description?: string;
	  };

export type TransformFunction<Type> = (value: Type) => Type;

export type Transform<Type> =
	| TransformFunction<Type>
	| {
			function: TransformFunction<Type>;
			description?: string;
	  };

import { formatValidators } from './format-validators';
import { generalValidators } from './general-validators';
import { logicalValidators } from './logic-validators';
import { networkValidators } from './network-validators';

export const validators = {
	formats: formatValidators,
	network: networkValidators,
	general: generalValidators,
	logic: logicalValidators
};

export default { ...formatValidators, ...networkValidators, ...generalValidators, ...logicalValidators };

export * from './types';

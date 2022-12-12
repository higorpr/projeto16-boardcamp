import joi from "joi";

export const customerSchema = joi.object({
	name: joi.string().min(3).required(),
	phone: joi
		.string()
		.pattern(/^[0-9]+$/)
		.min(10)
		.max(11),
	cpf: joi
		.string()
		.pattern(/^[0-9]+$/)
		.length(11),
	birthday: joi.string().isoDate().required(),
});

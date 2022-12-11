import { connection } from "../database/db.js";

export async function getCustomers(req, res) {
	const { cpf } = req.query;
	let customers;

	try {
		const cpfCheck = cpf ? cpf : "";
		const customerArr = await connection.query(
			`
            SELECT
                *
            FROM
                customers
            WHERE
                (cpf LIKE $1 || '%')
        `,
			[cpfCheck]
		);
		console.log(customerArr.rows);
		customers = customerArr.rows;
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
	res.status(200).send(customers);
}

export async function getCustomersById(req, res) {
	const id = res.locals.id;
	let customers;

	try {
		const customerArr = await connection.query(
			`
            SELECT
                *
            FROM
                customers
            WHERE
                (id = $1)
        `,
			[id]
		);
		console.log(customerArr.rows);
		customers = customerArr.rows;
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
	res.status(200).send(customers);
}

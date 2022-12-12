import { connection } from "../database/db.js";

export async function getCustomers(req, res) {
	const { cpf } = req.query;
	let customers;

	try {
		const cpfCheck = cpf ? cpf : "";
		const customerArr = await connection.query(
			`
            SELECT
                name, phone, cpf, TO_CHAR(birthday,'YYYY-MM-DD') AS birthday
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
				name, phone, cpf, TO_CHAR(birthday,'YYYY-MM-DD') AS birthday
            FROM
                customers
            WHERE
                (id = $1)
        `,
			[id]
		);

		customers = customerArr.rows[0];
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
	res.status(200).send(customers);
}

export async function postCustomer(req, res) {
	const { name, phone, cpf, birthday } = res.locals.customerInfo;

	const customerArray = [name, phone, cpf, birthday];
	try {
		await connection.query(
			`
			INSERT INTO
				customers (name, phone, cpf, birthday)
			VALUES
				($1, $2, $3, $4)
		`,
			customerArray
		);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
	res.sendStatus(201);
}

export async function updateCustomer(req, res) {
	const { name, phone, cpf, birthday } = res.locals.customerInfo;
	const { id } = req.params;
	const updateArr = [name, phone, cpf, birthday, id];

	try {
		await connection.query(
			`
			UPDATE
				customers
			SET
				name=$1, phone=$2, cpf=$3, birthday=$4
			WHERE
				id = $5
		`,
			updateArr
		);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}

	res.sendStatus(200)
}

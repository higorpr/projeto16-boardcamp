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

export async function postCustomer(req,res) {
    const {name, phone, cpf, birthday} = res.locals.customerInfo
	
	const customerArray = [name, phone, cpf, birthday]
	try {
		await connection.query(`
			INSERT INTO
				customers (name, phone, cpf, birthday)
			VALUES
				($1, $2, $3, $4)
		`,customerArray)
	} catch (err) {
		console.log(err)
		return res.sendStatus(500)
	}
	res.sendStatus(200)
}

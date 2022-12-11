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
                cpf
            LIKE
                $1 || '%'
        `,
			[cpfCheck]
		);
		customers = customerArr.rows;
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
	res.status(200).send(customers);
}

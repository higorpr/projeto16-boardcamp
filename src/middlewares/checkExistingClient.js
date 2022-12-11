import { connection } from "../database/db.js";

export async function CheckExistingClient(req, res, next) {
	const { id } = req.params;
	let checkedId = "";

	if (id && Number(id)) {
		try {
			const clientArr = await connection.query(`
                SELECT
                    *
                FROM
                    customers
            `);

			const clientIds = clientArr.rows.map((c) => c.id);

			if (!clientIds.includes(Number(id))) {
				return res.sendStatus(404);
			}

			checkedId = id;
		} catch (err) {
			console.log(err);
			return res.sendStatus(500);
		}
	} else {
		return res.sendStatus(404);
	}

	res.locals.id = checkedId;
	next();
}

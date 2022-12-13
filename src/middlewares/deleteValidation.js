import { connection } from "../database/db.js";

export async function deleteValidation(req, res, next) {
	const { id } = req.params;

	try {
		const rentals = await connection.query(
			`
            SELECT
                *
            FROM
                rentals
            WHERE
                id = $1
        `,
			[id]
		);
		const rentIds = rentals.rows.map((r) => r.id);

		// Check if provided id exists.
		if (!rentIds.includes(Number(id))) {
			return res.sendStatus(404);
		}

		// Check whether rental is finished.
		const finished = rentals.rows[0].returnDate;
		if (!finished) {
			return res.sendStatus(400);
		}
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}

	res.locals.id = id;

	next();
}

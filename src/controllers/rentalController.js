import { connection } from "../database/db.js";

export async function getRentals(req, res) {
	const { customerId, gameId } = req.query;
	console.log("Customer Id: ", customerId);
	console.log("Game Id: ", gameId);
	let rentals;

	try {
		if (customerId && gameId) {
			rentals = await connection.query(
				`
                SELECT
                    rentals.*,
                    json_build_object('id',customers.id, 'name', customers.name) as customer,
                    json_build_object('id',games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
                FROM
                    rentals JOIN games ON rentals."gameId" = games.id
                    JOIN customers ON rentals."customerId" = customers.id
                    JOIN categories ON games."categoryId" = categories.id
                WHERE
                    customers.id=$1 AND games.id=$2

        `,
				[customerId, gameId]
			);
		} else if (customerId && !gameId) {
			rentals = await connection.query(
				`
                SELECT
                    rentals.*,
                    json_build_object('id',customers.id, 'name', customers.name) as customer,
                    json_build_object('id',games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
                FROM
                    rentals JOIN games ON rentals."gameId" = games.id
                    JOIN customers ON rentals."customerId" = customers.id
                    JOIN categories ON games."categoryId" = categories.id
                WHERE
                    customers.id=$1

        `,
				[customerId]
			);
		} else if (!customerId && gameId) {
			rentals = await connection.query(
				`
                SELECT
                    rentals.*,
                    json_build_object('id',customers.id, 'name', customers.name) as customer,
                    json_build_object('id',games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
                FROM
                    rentals JOIN games ON rentals."gameId" = games.id
                    JOIN customers ON rentals."customerId" = customers.id
                    JOIN categories ON games."categoryId" = categories.id
                WHERE
                    games.id=$1

        `,
				[gameId]
			);
		} else {
			rentals = await connection.query(`
                SELECT
                    rentals.*,
                    json_build_object('id',customers.id, 'name', customers.name) as customer,
                    json_build_object('id',games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
                FROM
                    rentals JOIN games ON rentals."gameId" = games.id
                    JOIN customers ON rentals."customerId" = customers.id
                    JOIN categories ON games."categoryId" = categories.id
        `);
		}

		res.status(200).send(rentals.rows);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

// SELECT rentals,*, row_to_json(c) AS customer, row_to_json(g) as game
// FROM (
//     SELECT
//         g.id, g.name, g."categoryId", category.name AS "categoryName"
//     FROM
//         games g
//     JOIN
//         categories
//     ON
//         games."categoryId" = categories.id
//     ) g
// JOIN
//     (SELECT
//         rentals.*, row_to_json(c) AS customer
//     FROM (
//         SELECT
//             id, name
//         FROM
//             customers
//         ) c
//     JOIN
//         rentals
//     ON
//         c.id = rentals."customerId")
// ON
//     rentals."gameId" = g.id

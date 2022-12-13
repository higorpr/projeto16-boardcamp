import dayjs from "dayjs";
import "dayjs/locale/pt-br.js";
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

export async function postRental(req, res) {
	const { customerId, gameId, daysRented } = res.locals.rentalInfo;
	const returnDate = null;
	const delayFee = null;
	const rentDate = dayjs().format("YYYY-MM-DD");

	const openRents = await connection.query(
		`
        SELECT
            *
        FROM
            rentals
        WHERE
            rentals."gameId" = $1
    `,
		[gameId]
	);

	const rentedCopies = openRents.rows.length;

	const stockedGames = await connection.query(
		`
        SELECT
            *
        FROM
            games
        WHERE
            games.id = $1
    `,
		[gameId]
	);

	const stock = stockedGames.rows[0].stockTotal;
	const priceperDay = stockedGames.rows[0].pricePerDay;
	const originalPrice = daysRented * priceperDay;

	if (rentedCopies >= stock) {
		return res.sendStatus(400);
	}

	try {
		const rentalArray = [
			customerId,
			gameId,
			rentDate,
			daysRented,
			returnDate,
			originalPrice,
			delayFee,
		];

		await connection.query(
			`
            INSERT INTO
                rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES
                ($1, $2, $3, $4, $5, $6, $7)
        `,
			rentalArray
		);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}

	res.sendStatus(201);
}

export async function finishRental(req, res) {
	const id = res.locals.id;
	const returnDate = dayjs();

    // Calculate delayFee based on returnDate and rentDate
	try {
		const rental = await connection.query(
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
		const rentDate = dayjs(rental.rows[0].rentDate);
        const daysRented = rental.rows[0].daysRented
		const delay = returnDate.diff(rentDate, "days") - daysRented;
		const gameId = rental.rows[0].gameId;
		const gameInfo = await connection.query(
			`
            SELECT
                *
            FROM
                games
            WHERE
                id = $1
        `,
			[gameId]
		);

		const pricePerDay = gameInfo.rows[0].pricePerDay;
		const delayFee = (delay > daysRented) ? delay * pricePerDay : 0;
        
        //Update rentals database
        await connection.query(`
            UPDATE
                rentals
            SET
                "returnDate" = $1, "delayFee"=$2
            WHERE
                id = $3
        `,[returnDate, delayFee, id])
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}

	res.sendStatus(200);
}

export async function deleteRental(req, res) {}

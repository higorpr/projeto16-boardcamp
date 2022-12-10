import { connection } from "../database/db.js";

export async function getCategories(req, res) {
	let allCategories;
	try {
		const response = await connection.query(`
        SELECT * FROM categories;
    `);
		allCategories = response.rows;
	} catch (err) {
		console.log(err);
	}

	res.status(200).send(allCategories);
}

export async function postCategory(req, res) {
	const name = res.locals.name;
	
    try {
        await connection.query(`
            INSERT INTO
                categories (name)
            VALUES
                ($1)
        `, [name])
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    res.sendStatus(201)
}

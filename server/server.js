//Creating and initializing express app,intro to backend
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./db");

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//get all resturants
app.get("/api/v1/user", async (req, res) => {

    try {
        const results = await db.query("select * from individual");
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                users: results.rows,
            },
        });

    } catch (err){
        console.log(err);
    }
});

//get a single resturant
app.get("/api/v1/user/:id", async (req, res) => {
    try{
        const results = await db.query("select * from individual where id = $1", [req.params.id]);
        console.log(results.rows[0])
        res.status(200).json({
            status: "success",
            data: {
                user: results.rows[0],
            },
        });
    } catch (err){
        console.log(err)
    }
});

//add a user
app.post("/api/v1/user", async (req, res) => {
    try {
        const results = await db.query(
        "INSERT INTO individual (name, resturant, position, location, time, offer, time_posted) values ($1, $2, $3, $4, $5, $6, $7) returning *", 
        [req.body.name, req.body.resturant, req.body.position, req.body.location, req.body.time, req.body.offer, req.body.time_posted]
        );
        console.log(results);
        res.status(201).json({
            status: "success",
            data: {
                user: results.rows[0],
            },
        });
    } catch (err) {
        console.log(err);
    }
});

//update user
app.put("/api/v1/user/:id", async (req, res) => {
    try {
        const results = await db.query(
            "UPDATE individual SET name = $1, resturant = $2, position = $3, location = $4, time = $5, offer = $6, time_posted = $7 where id = $8 returning *", 
            [req.body.name, req.body.resturant, req.body.position, req.body.location, req.body.time, req.body.offer, req.body.time_posted, req.params.id]
        );
        res.status(200).json({
            status: "success",
            data: {
                user: results.rows[0]
            },
        });
    } catch (err) {
        console.log(err);
    }
});

//delete user

app.delete("/api/v1/user/:id", async (req, res) => {
    try {
        const results = await db.query("DELETE from individual where id = $1", [req.params.id]);
        res.status(204).json({
            status: "success",
        });
    } catch (err) {
        console.log(err);
    }

});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`server is up and listening on port ${port}`);
});

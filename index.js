require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 9000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s1xse.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    console.log("database connected");
    const db = client.db("ExpenseTracker");
    const transactionsCollection = db.collection("transactions");

    // get all transactions
    app.get("/transactions", async (req, res) => {
      const cursor = transactionsCollection.find({});
      const transactions = await cursor.toArray();
      res.send(transactions);
    });

    // get one transactions
    // app.get("/transaction/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const transaction = await transactionsCollection.findOne(query);
    //   res.send(transaction);
    // });

    // post transaction
    app.post("/transactions", async (req, res) => {
      const transactions = req.body;
      const result = await transactionsCollection.insertOne(transactions);
      res.send(result);
    });

    // delete transaction
    app.delete("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      const result = await transactionsCollection.deleteOne({
        _id: ObjectId(id),
      });
      res.send(result);
    });

    // update transactions
    app.put("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          name: req.body.name,
          type: req.body.type,
          amount: req.body.amount,
        },
      };
      const result = await transactionsCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

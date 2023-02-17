require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

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
    const db = client.db("myBlog");
    const blogsCollection = db.collection("blogs");

    // get all blogs
    app.get("/blogs", async (req, res) => {
      const cursor = blogsCollection.find({});
      const blogs = await cursor.toArray();
      res.send({ status: true, data: blogs });
    });

    // get one blog
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const blog = await blogsCollection.findOne(query);
      res.send(blog);
    });

    // post blog
    app.post("/blog", async (req, res) => {
      const blog = req.body;
      const result = await blogsCollection.insertOne(blog);
      res.send(result);
    });

    // delete blog
    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const result = await blogsCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    // update blog
    app.put("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          model: req.body.model,
          brand: req.body.brand,
          status: req.body.status,
          price: req.body.price,
          keyFeature: [
            req.body.keyFeature1,
            req.body.keyFeature2,
            req.body.keyFeature3,
            req.body.keyFeature4,
          ],
          spec: [],
        },
      };
      const result = await blogsCollection.updateOne(filter, updateDoc);
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

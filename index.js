const express = require('express');
const app = express();
const cors = require('cors');

require ('dotenv').config();
const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sfmd0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


async function run() {
    try {
        await client.connect();
        const database = client.db('Toys-zone');
        const productsCollection = database.collection('products');
        const reviewsCollection = database.collection('reviews');
        const usersCollection = database.collection('users');
        const orderCollection = database.collection('order');


       // GET PRODUCTS API
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        // GET SINGLE PRODUCT API
        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.findOne(query);
            res.json(result);
            
        })

        app.get('/order', async(req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const cursor = orderCollection.find(query);
            const order = await cursor.toArray();
            res.json(order);
            
        })
        app.get('/allOrders', async(req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        // GET REVIEW API
        app.get('/reviews', async(req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // POST REVIEW API
        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(review);
        })

        // POST PRODUCTS API
        app.post('/products', async(req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(product);
        })

        app.post('/order', async(req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
            
        })

        app.get('/users/:email', async(req, res) => {
            const email = req.params.email;
            const query = {email: email};
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if(user?.role === 'admin'){
                isAdmin = true;
            }
            res.json({admin: isAdmin})
        })

        // POST USER API
        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
            
        })

        // UPSERT USER DATA
        app.put('/users', async(req, res) => {
            const user = req.body;
            const filter = {email: user.email};
            const options = {upsert: true};
            const updateDoc = {$set: user};
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        app.put('/users/admin',  async(req, res) => {
            const user = req.body;
            const requester = req.decodedEmail;
            const filter = {email: user.email};
            const updateDoc = {$set: {role: 'admin'}}
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
            
        })

        // DELETE PRODUCTS API
        // app.delete('/products/:id', async(req, res) => {
        //    const id = req.params.id;
        //    const query = {_id:ObjectId(id)};
        //    const result = await productsCollection.deleteOne(query);
        //    res.json(result);
          
        // })
        
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);














app.get('/', (req, res) => {
    res.send('Hello Toy Zone')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
});

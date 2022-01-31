import { MongoClient } from "mongodb";

async function handler(req,res) {
    if (req.method === 'POST') {
        const data = req.body;
        const client = await MongoClient.connect(`mongodb+srv://task:tasks123@cluster0.dsxcn.mongodb.net/meetups?retryWrites=true&w=majority`);
        const db = client.db();

        const meetupsCollection = db.collection('meetups');

        const result = await meetupsCollection.insertOne(data);

        console.log(result);

        client.close();

        res.status(201).json({ message: 'Meetup inserted!' });
    }
}

export default handler;
//"api folder" runs on server side so all credentials will not be visible to client
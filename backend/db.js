const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://diego99rojo:${process.env.MONGO_PASSWORD}@park-hopper.fzoiiv4.mongodb.net/?retryWrites=true&w=majority&appName=Park-Hopper`;


const client = new MongoClient(uri);
async function run() {
  try {
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);
    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
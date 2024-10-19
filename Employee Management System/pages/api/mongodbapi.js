// pages/api/users.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('yourDatabaseName'); // Replace with your database name
    const collection = db.collection('users'); // Replace with your collection name

    if (req.method === 'GET') {
      const { search } = req.query;

      // Build the query based on the search parameter
      const query = {
        $or: [
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { contact_number: { $regex: search } }
        ]
      };

      // Fetch matching users from MongoDB
      const filteredData = await collection.find(query).toArray();

      res.status(200).json(filteredData);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    res.status(500).json({ error: 'Error connecting to MongoDB' });
  }
}

import path from 'path';
import fs from 'fs';

const dataFilePath = path.join(process.cwd(), 'public', 'user_list.json');

// Helper function to read data
const readData = () => {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write data
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

export default function handler(req, res) {
  try {
    const data = readData();

    switch (req.method) {
      case 'GET': {
        const { search } = req.query;

        const filteredData = data.filter((user) => {
          return (
            (user.first_name && user.first_name.toLowerCase().includes(search.toLowerCase())) ||
            (user.last_name && user.last_name.toLowerCase().includes(search.toLowerCase())) ||
            (user.city && user.city.toLowerCase().includes(search.toLowerCase())) ||
            (user.contact_number && user.contact_number.includes(search))
          );
        });

        res.status(200).json(filteredData);
        break;
      }

      case 'POST': {
        const { first_name, last_name, city, contact_number } = req.body;

        if (!first_name || !last_name || !city || !contact_number) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const newUser = {
          id: Date.now().toString(), // Generate a unique ID for each user
          first_name,
          last_name,
          city,
          contact_number,
        };

        data.push(newUser);
        writeData(data);

        res.status(201).json(newUser); // Respond with the newly created user
        break;
      }

      case 'PUT': {
        const { id } = req.query;
        const { first_name, last_name, city, contact_number } = req.body;

        const userIndex = data.findIndex((user) => user.id === id);
        if (userIndex === -1) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Update the user details
        data[userIndex] = {
          ...data[userIndex],
          first_name,
          last_name,
          city,
          contact_number,
        };
        writeData(data);

        res.status(200).json(data[userIndex]);
        break;
      }

      case 'DELETE': {
        const { first_name, last_name, city } = req.query; // Use query params for user identification
      
        const newData = data.filter((user) => {
          return !(user.first_name === first_name && user.last_name === last_name && user.city === city);
        });
      
        if (newData.length === data.length) {
          return res.status(404).json({ error: 'User not found' });
        }
      
        writeData(newData);
        res.status(200).json({ message: 'User deleted successfully' });
        break;
      }
      

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error handling the request' });
  }
}

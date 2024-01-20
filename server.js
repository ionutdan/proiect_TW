const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const createMenuModel = require('./models/menu'); // Import the menu model
const createRestaurantModel = require('./models/restaurant'); // Import the restaurant model
const cors = require('cors'); // Import cors

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Create the models using Sequelize and pass the sequelize instance
const Menu = createMenuModel(sequelize);
const Restaurant = createRestaurantModel(sequelize);

// Define associations here
Restaurant.hasMany(Menu, { foreignKey: 'restaurantId' });
Menu.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

// Define API routes

// Create a new restaurant
app.post('/api/restaurants', async (req, res) => {
  try {
    const { name, address, revenue, expenses } = req.body;
    const restaurant = await Restaurant.create({ name, address, revenue, expenses });
    res.json(restaurant);
  } catch (error) {
    console.error('Error adding restaurant:', error);
    res.status(500).json({ error: 'Failed to add restaurant' });
  }
});

// Create a new menu (uncomment this route if needed)
app.post('/api/menus', async (req, res) => {
  try {
    const { type, restaurantId } = req.body;
    const menu = await Menu.create({ type, restaurantId }); // Associate menu with restaurant using restaurantId
    res.json(menu);
  } catch (error) {
    console.error('Error adding menu:', error);
    res.status(500).json({ error: 'Failed to add menu' });
  }
});

// Create a new menu associated with a specific restaurant
app.post('/api/restaurants/:restaurantId/menus/', async (req, res) => {
  try {
    const { type } = req.body;
    const { restaurantId } = req.params; // Access restaurantId from req.params
    const menu = await Menu.create({ type, restaurantId }); // Associate menu with restaurant using restaurantId
    res.json(menu);
  } catch (error) {
    console.error('Error adding menu:', error);
    res.status(500).json({ error: 'Failed to add menu' });
  }
});

// Retrieve all restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (error) {
    console.error('Error retrieving restaurants:', error);
    res.status(500).json({ error: 'Failed to retrieve restaurants' });
  }
});

// Delete all items from both Restaurant and Menu tables
app.delete('/api/delete-all', async (req, res) => {
    try {
      // Delete all menus first
      await Menu.destroy({ where: {} });
  
      // Then delete all restaurants
      await Restaurant.destroy({ where: {} });
  
      res.json({ message: 'All items deleted successfully' });
    } catch (error) {
      console.error('Error deleting all items:', error);
      res.status(500).json({ error: 'Failed to delete all items' });
    }
  });

// Retrieve menus for a specific restaurant
app.get('/api/restaurants/:restaurantId/menus', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menus = await Menu.findAll({ where: { restaurantId } });
    res.json(menus);
  } catch (error) {
    console.error('Error retrieving menus:', error);
    res.status(500).json({ error: 'Failed to retrieve menus' });
  }
});

app.get('/api/menus', async (req, res) => {
    try {
      const menus = await Menu.findAll();
      res.json(menus);
    } catch (error) {
      console.error('Error retrieving menus:', error);
      res.status(500).json({ error: 'Failed to retrieve menus' });
    }
  });

// Start the server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
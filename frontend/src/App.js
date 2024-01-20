import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ReactBingmaps } from 'react-bingmaps';

function App() {
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    address: '',
    revenue: '',
    expenses: '',
  });

  const [menuData, setMenuData] = useState({
    type: '',
    items: [],
  });
 
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showAllRestaurants, setShowAllRestaurants] = useState(false);
  const [allRestaurantMenus, setAllRestaurantMenus] = useState([]);

  useEffect(() => {
   fetchRestaurants();
   fetchAllMenus();
  
    
  }, []);


  const geocodeAddress = async (address) => {
    try {
      const response = await axios.get('https://dev.virtualearth.net/REST/v1/Locations', {
        params: {
          q: address,
          key: 'Ag2tKoYV9UqYnWsarj4CNjH4CDvzeBRqsA9UE5NJqCeidaurjKVY8fi-sk7Fyr-O',
        },
      });
  
      const coordinates = response.data.resourceSets[0].resources[0].point.coordinates;
      return [coordinates[0], coordinates[1]];
    } catch (error) {
      console.error('Error geocoding address:', error);
      return [0, 0]; // Default coordinates if geocoding fails
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/restaurants');
      const restaurantsWithLocation = await Promise.all(
        response.data.map(async (restaurant) => {
          // Use the geocoding service to get coordinates based on the address
          const coordinates = await geocodeAddress(restaurant.address);
          return { ...restaurant, location: coordinates, option:{title: restaurant.name} };
        })

      );
      setRestaurants(restaurantsWithLocation);
    } catch (error) {
      console.error('Eroare la preluarea restaurantelor:', error);
    }
  };

  const handleRestaurantSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/restaurants', restaurantData);
      console.log('Restaurant adăugat cu succes:', response.data);
      // Refresh the list of restaurants after adding a new one
      fetchRestaurants();
      setRestaurantData({ name: '', address: '', revenue: 0, expenses: 0 });
    } catch (error) {
      console.error('Eroare la adăugarea restaurantului:', error);
    }
  };

  const handleRestaurantSelect = (restaurant) => {
    // Set the selected restaurant for adding menus
    setSelectedRestaurant(restaurant);
  };

  const handleMenuSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`http://localhost:3000/api/restaurants/${selectedRestaurant.id}/menus/`, menuData);
      console.log('Meniu adăugat cu succes:', response.data);
      // Clear menu form and refresh the list of menus for the selected restaurant
      setMenuData({ type: '', items: [] });
      // Refetch menus for all restaurants
      fetchAllMenus();
    } catch (error) {
      console.error('Eroare la adăugarea meniului:', error);
    }
  };

  const fetchAllMenus = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/menus`);
      setAllRestaurantMenus(response.data);
    } catch (error) {
      console.error('Eroare la preluarea tuturor meniurilor:', error);
    }
  };

  const handleShowAllRestaurants = () => {
    setShowAllRestaurants(true);
  };

  const handleClearDatabase = async () => {
    try {
      const response = await axios.delete('http://localhost:3000/api/delete-all');
      console.log('Toate înregistrările au fost șterse cu succes:', response.data.message);
      // Optionally, you can update the UI to reflect the deletion.
    } catch (error) {
      console.error('Eroare la ștergerea tuturor înregistrărilor:', error);
    }
  };


  return (
    <div>
      <button onClick={handleClearDatabase}>Clear Database</button>
      <h1>Adăugare Restaurant</h1>
      <form onSubmit={handleRestaurantSubmit}>
        <input
          type="text"
          placeholder="Nume restaurant"
          value={restaurantData.name}
          onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Adresă restaurant"
          value={restaurantData.address}
          onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
        />
        <input
          type="number"
          placeholder="Încasări"
          value={restaurantData.revenue}
          onChange={(e) => setRestaurantData({ ...restaurantData, revenue: parseFloat(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Cheltuieli"
          value={restaurantData.expenses}
          onChange={(e) => setRestaurantData({ ...restaurantData, expenses: parseFloat(e.target.value) })}
        />
        <button type="submit">Adaugă Restaurant</button>
      </form>
      <h2>Toate Restaurantele</h2>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            {restaurant.name}{' '}
            <button onClick={() => handleRestaurantSelect(restaurant)}>Selectează</button>
          </li>
        ))}
      </ul>

      {selectedRestaurant && (
        <div>
          <h1>Adăugare Meniu pentru {selectedRestaurant.name}</h1>
          <form onSubmit={handleMenuSubmit}>
            <input
              type="text"
              placeholder="Produs"
              value={menuData.type}
              onChange={(e) => setMenuData({ ...menuData, type: e.target.value })}
            />
            <button type="submit">Adaugă Produs</button>
          </form>
        </div>
      )}

      {/* Button to show the table */}
      {!showAllRestaurants && (
        <button onClick={handleShowAllRestaurants}>Arată Toate Restaurantele</button>
      )}

      {/* Table */}
      {showAllRestaurants && (
        <div>
          <h2>Toate Restaurantele și Meniurile</h2>
          <table>
            <thead>
              <tr>
                <th>Nume Restaurant</th>
                <th>Adresă</th>
                <th>Încasări</th>
                <th>Cheltuieli</th>
                <th>Meniuri</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant.id}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.address}</td>
                  <td>{restaurant.revenue}</td>
                  <td>{restaurant.expenses}</td>
                  <td>
                    <ul>
                      {allRestaurantMenus
                        .filter((menu) => menu.restaurantId === restaurant.id)
                        .map((menu) => (
                          <li key={menu.id}>{menu.type}</li>
                        ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  </div>
)}
  <div style={{width: "100%", height : 500}}>
    <ReactBingmaps
      bingmapKey = "Ag2tKoYV9UqYnWsarj4CNjH4CDvzeBRqsA9UE5NJqCeidaurjKVY8fi-sk7Fyr-O" 
      center = {[44.43527985, 26.10277939]}
      pushPins = {restaurants}
      
    >
    </ReactBingmaps>
  </div>
    </div>
  );
}

export default App;
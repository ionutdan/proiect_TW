import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    address: '',
    revenue: 0,
    expenses: 0,
  });

  const [menuData, setMenuData] = useState({
    type: '',
    items: [],
  });

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showAllRestaurants, setShowAllRestaurants] = useState(false);

  useEffect(() => {
    // Fetch the list of restaurants when the component mounts
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/restaurants');
      setRestaurants(response.data);
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
    // Fetch the menus for the selected restaurant
   //fetchMenus(restaurant.id);
  };

  const handleMenuSubmit = async (event) => {
    event.preventDefault();
    console.log('Selected Restaurant ID:', selectedRestaurant.id);

    try {
      const response = await axios.post(`http://localhost:3000/api/restaurants/${selectedRestaurant.id}/menus/`, menuData);
      console.log('Meniu adăugat cu succes:', response.data);
      // Clear menu form and refresh the list of menus
      setMenuData({ type: '', items: [] });
      fetchMenus(selectedRestaurant.id);
    } catch (error) {
      console.error('Eroare la adăugarea meniului:', error);
    }
  };

  

  const fetchMenus = async (restaurantId) => {
    try {
      // Check this URL to ensure it's correct
      const response = await axios.get(`http://localhost:3000/api/restaurants/${restaurantId}/menus/`);
      setSelectedRestaurantMenus(response.data);
    } catch (error) {
      console.error('Eroare la preluarea meniurilor:', error);
    }
  };

  const [selectedRestaurantMenus, setSelectedRestaurantMenus] = useState([]);

  const handleShowAllRestaurants = () => {
    setShowAllRestaurants(true);
  };

  const handleDeleteAll = async () => {
    try {
      const response = await axios.delete('http://localhost:3000/api/delete-all');
      console.log('Toate înregistrările au fost șterse cu succes:', response.data.message);
  
      // Opțional, puteți actualiza interfața utilizatorului pentru a reflecta ștergerea
    } catch (error) {
      console.error('Eroare la ștergerea tuturor înregistrărilor:', error);
    }
  };

  
  

  return (
   
    <div>
      <head><script type="text/javascript" src="https://www.bing.com/api/maps/mapcontrol?callback=loadMapScenario&key=Ag2tKoYV9UqYnWsarj4CNjH4CDvzeBRqsA9UE5NJqCeidaurjKVY8fi-sk7Fyr-O" async defer></script></head> 
      <button onClick={handleDeleteAll}>Șterge toate înregistrările</button>
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

      <h1>Adăugare Meniu</h1>
      {selectedRestaurant && (
        <form onSubmit={handleMenuSubmit}>
          <input
            type="text"
            placeholder="Tip meniu"
            value={menuData.type}
            onChange={(e) => setMenuData({ ...menuData, type: e.target.value })}
          />
          {/* Adăugați câmpurile pentru produse și prețuri aici */}
          <button type="submit">Adaugă Meniu</button>
        </form>
      )}

      {showAllRestaurants ? (
        <div>
          <h2>Toate Restaurantele</h2>
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant.id}>{restaurant.name}</li>
            ))}
          </ul>
          <h2>Meniuri pentru restaurantul selectat</h2>
          <ul>
            {selectedRestaurantMenus.map((menu) => (
              <li key={menu.id}>{menu.type}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2>Restaurante</h2>
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant.id} onClick={() => handleRestaurantSelect(restaurant)}>
                {restaurant.name}
              </li>
            ))}
          </ul>
          {selectedRestaurant && (
            <button onClick={handleShowAllRestaurants}>Arată Toate Restaurantele și Meniurile</button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const calculateAverageLocation = (locations) => {
    if (locations.length === 1) {
        // Only one location, use its coordinates
        const { lat, lon } = locations[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };

    } else if (locations.length > 1) {
        // If more then one location calculate average of latitudes and longitudes
        let totalLat = 0;
        let totalLon = 0;

        locations.forEach(location => {
            totalLat += parseFloat(location.lat);
            totalLon += parseFloat(location.lon);
        });

        const latitude = totalLat / locations.length;
        const longitude = totalLon / locations.length;

        return { longitude, latitude };
    } else {
        throw new Error('No location data found');
    }
};

export const getAddressCordinates = async (address) => {
    try {
        const url = `https://geocode.maps.co/search?q=${encodeURIComponent(address)}&api_key=${process.env.GEOCODE_API_KEY}`;
        console.log(url)
        const response = await axios.get(url);

        if (response.status !== 200) {
            throw new Error('Failed to fetch location details');
        }

        const { longitude, latitude} = calculateAverageLocation(response.data);
        return {longitude, latitude}
        
    } catch (error) {
        console.error('Error fetching location details:', error.message);
        throw error;
    }
};

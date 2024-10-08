import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const calculateAverageLocation = (locations) => {
    
    if (locations.length === 1) {
        const { lat, lon } = locations[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else if (locations.length > 1) {
        let totalLat = 0, totalLon = 0;

        locations.forEach((location) => {
            totalLat += parseFloat(location.lat);
            totalLon += parseFloat(location.lon);
        });

        const latitude = totalLat / locations.length;
        const longitude = totalLon / locations.length;

        return { longitude, latitude };
    } else {
        throw new Error("No location data found");
    }
};

function simplifyAddress(address) {
  const parts = address.split(",").map((part) => part.trim());
  const cityCountry = parts.slice(-2).join(", ");
  const componentPattern = /\b([A-Za-z\s]+)\b (?:Road|Town|Cantt')/i;
  let simplifiedAddress = "";

  parts.forEach((part) => {
    const match = part.match(componentPattern);
    if (match) {
      simplifiedAddress = `${match[0].match(/\w+\s+\w+$/)[0]}, ${cityCountry}`;
    }
  });

  if (!simplifiedAddress) {
    simplifiedAddress = cityCountry;
  }
  return simplifiedAddress;
}

export const getAddressCordinates = async (address) => {
  try {
    const formattedAddress = simplifyAddress(address);
    console.log(formattedAddress);
    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(
      formattedAddress
    )}&api_key=${process.env.GEOCODE_API_KEY}`;
    console.log("url is", url);
    const response = await axios.get(url);
    console.log(response.data);

    if (response.status !== 200) {
      throw new Error("Failed to fetch location details");
    }

    const { longitude, latitude } = calculateAverageLocation(response.data);
    if (longitude == 0) {
      console.log("hello  ");
    }
    return { longitude, latitude };
  } catch (error) {
    console.error("Error fetching location details:", error.message);
    throw error;
  }
};

export const calculateDistance = (coords1, coords2) => {
  const lat1 = coords1[1];
  const lon1 = coords1[0];
  const lat2 = coords2[1];
  const lon2 = coords2[0];

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const axios = require('axios');

/**
 * to find nearest emergency responders using OpenStreetMap Overpass API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters (default: 5000m = 5km)
 * @returns {Promise<Array>} Array of responders with name, type, lat, lng
 */
async function findNearestResponders(lat, lng, radius = 5000) {
    try {
        // overpass API endpoint
        const overpassUrl = 'https://overpass-api.de/api/interpreter';

        // this is overpass QL query to find hospitals, police stations, and fire stations
        // [out:json] - output format
        // node/way - search both nodes and ways
        // around:radius - search within radius meters
        // amenity=hospital|police|fire_station - filter by amenity type
        const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        way["amenity"="hospital"](around:${radius},${lat},${lng});
        node["amenity"="police"](around:${radius},${lat},${lng});
        way["amenity"="police"](around:${radius},${lat},${lng});
        node["amenity"="fire_station"](around:${radius},${lat},${lng});
        way["amenity"="fire_station"](around:${radius},${lat},${lng});
      );
      out center;
    `;

        const response = await axios.post(overpassUrl, `data=${encodeURIComponent(query)}`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000 // 10 second ka timeout
        });

        const elements = response.data.elements || [];

        // process and clean the data
        const responders = elements.map(element => {
            // for ways, use center coordinates; for nodes, use direct coordinates
            const elementLat = element.center ? element.center.lat : element.lat;
            const elementLng = element.center ? element.center.lon : element.lon;

            // calculate distance from user location (Haversine formula)
            const distance = calculateDistance(lat, lng, elementLat, elementLng);

            return {
                name: element.tags.name || `Unnamed ${element.tags.amenity}`,
                type: element.tags.amenity, // 'hospital', 'police', or 'fire_station'
                lat: elementLat,
                lng: elementLng,
                distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
            };
        });

        // sort by distance (nearest first) and limit to top 10
        responders.sort((a, b) => a.distance - b.distance);

        return responders.slice(0, 10);
    } catch (error) {
        console.error('Error fetching responders from Overpass API:', error.message);
        throw new Error('Failed to fetch nearest responders');
    }
}

/**
 * calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

module.exports = {
    findNearestResponders
};

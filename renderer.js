async function fetchAllPrayerTimes() {
    const zonesUrl = 'https://api.waktusolat.app/zones';
    const baseUrl = 'https://api.waktusolat.app/solat/';

    try {
        // Fetch the list of zones
        const zonesResponse = await fetch(zonesUrl);
        if (!zonesResponse.ok) {
            throw new Error(`Failed to fetch zones: ${zonesResponse.status}`);
        }
        const zones = await zonesResponse.json();

        // Iterate over each zone to fetch prayer times
        for (const zone of zones) {
            const response = await fetch(`${baseUrl}${zone}`);
            if (!response.ok) {
                console.error(`Failed to fetch prayer times for zone ${zone}: ${response.status}`);
                continue;
            }
            const data = await response.json();
            console.log(`Prayer times for zone ${zone}:`, data);
            // Process the data as needed
        }
    } catch (error) {
        console.error('Error fetching prayer times:', error);
    }
}

// Call the function
fetchAllPrayerTimes();

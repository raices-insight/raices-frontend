import { Text, View } from "@/src/core/ui/tw";
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { CONFIG } from '@/core/config';

const API_URL = CONFIG.API_URL.replace(":3000", ":8080");

export function LocationIndicator() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      // For web, request foreground location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Small delay to match native behavior
      await new Promise(resolve => setTimeout(resolve, 500));
      try {
        const loc = await Location.getCurrentPositionAsync({});
        console.log("Web coordinates:", loc.coords.latitude, loc.coords.longitude);
        setLocation(loc);

        // Report location to backend on the web platform
        if (API_URL) {
          await fetch(`${API_URL}/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            }),
          }).catch(err => console.error("Error reporting location on web:", err));
        }
      } catch (error) {
        console.warn("Retrying location fetch on web...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
          const loc = await Location.getCurrentPositionAsync({});
          console.log("Web coordinates (retry):", loc.coords.latitude, loc.coords.longitude);
          setLocation(loc);

          // Report location to backend on retry
          if (API_URL) {
            await fetch(`${API_URL}/location`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              }),
            }).catch(err => console.error("Error reporting location on web:", err));
          }
        } catch (retryError) {
          console.error("Failed to get location on web:", retryError);
          setErrorMsg('Unable to retrieve location');
        }
      }
    }

    getCurrentLocation();
  }, []);

  let text = 'Esperando...';
  if (errorMsg) {
    text = errorMsg;
    return (
      <Text className="font-headline font-bold text-[36px] leading-[48px] text-raices-secondary text-center tracking-tight">
        {text}
      </Text>
    );
  } else if (location) {
    // OpenStreetMap bounding box for iframe [min_lon, min_lat, max_lon, max_lat]
    const delta = 0.002;
    const lon = location.coords.longitude;
    const lat = location.coords.latitude;
    const minLon = lon - delta;
    const minLat = lat - delta;
    const maxLon = lon + delta;
    const maxLat = lat + delta;
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${lat}%2C${lon}`;

    return (
      <View 
        className="overflow-hidden rounded-[16px] border border-raices-secondary/15 shadow-sm" 
        style={{ height: 300, width: 300 }}
      >
        <iframe
          src={mapUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title="User Location Map"
        />
      </View>
    );
  }

  // Loading state matching native typography and style
  return (
    <View className="items-center justify-center" style={{ height: 300, width: 300 }}>
      <Text className="font-headline font-bold text-[24px] text-raices-text-muted">
        {text}
      </Text>
    </View>
  );
}

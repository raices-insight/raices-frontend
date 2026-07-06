import { Text, View } from "@/src/core/ui/tw";
import { useOlderAdultLocation } from "../hooks/use-older-adult-location";

export function LocationIndicator({ profileId }: { profileId?: string }) {
  const { location } = useOlderAdultLocation(profileId);

  if (location.latitude === 0 && location.longitude === 0) {
    return (
      <View className="items-center justify-center" style={{ height: 300, width: 300 }}>
        <Text className="font-headline font-bold text-[24px] text-raices-text-muted">
          No hay ubicación reportada recientemente
        </Text>
      </View>
    );
  }

  // OpenStreetMap bounding box for iframe [min_lon, min_lat, max_lon, max_lat]
  const delta = 0.002;
  const lon = location.longitude;
  const lat = location.latitude;
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
        title="Older Adult Location Map"
      />
    </View>
  );
}

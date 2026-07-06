import { Text, View } from "@/src/core/ui/tw";
import { Camera, Map, Marker } from "@maplibre/maplibre-react-native";
import { useOlderAdultLocation } from "../hooks/use-older-adult-location";

export function LocationIndicator({ profileId }: { profileId?: string }) {
  const { location } = useOlderAdultLocation(profileId);

  if (location.latitude === 0 && location.longitude === 0) {
    return (
      <View>
        <Text>No hay ubicación reportada recientemente</Text>
      </View>
    );
  }

  return (
    <View
      style={{ height: 300, width: '100%', overflow: "hidden" }}
      className="flex"
    >
      <Map
        mapStyle={
          "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json"
        }
      >
        <Camera
          zoom={16}
          center={[location.longitude, location.latitude]}
        ></Camera>
        <Marker lngLat={[location.longitude, location.latitude]}>
          <Text className="font-bold text-[24px]">📍</Text>
        </Marker>
      </Map>
    </View>
  );
}

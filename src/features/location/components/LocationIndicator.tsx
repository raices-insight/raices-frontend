import { Text, View } from "@/src/core/ui/tw";
import { Camera, Map, Marker } from "@maplibre/maplibre-react-native";
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export function LocationIndicator(){
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(()=>{
        async function getCurrentLocation(){
            let {status}=await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }

        getCurrentLocation();
    },[])
    let text = 'Esperando...';
    if (errorMsg) {
        text = errorMsg;
        return (<Text className="font-headline font-bold text-[72px] leading-[84px] text-raices-secondary text-center tracking-tight">
            {text}
        </Text>)

    } else if (location) {
        text = JSON.stringify(location);
        return (
            <View style={{height:300,width:300}}>
                <Map mapStyle={"https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json"} >
                    <Camera
                        zoom={16}
                        center={[location!.coords.longitude, location!.coords.latitude]}
                    >
                        
                    </Camera>
                    <Marker lngLat={[location!.coords.longitude, location!.coords.latitude]}>
                        <Text>
                            V
                        </Text>
                    </Marker>
                </Map>
            </View>
)
        
    }
    
}
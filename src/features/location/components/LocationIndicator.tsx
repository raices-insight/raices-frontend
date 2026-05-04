import { Text } from "@/src/core/ui/tw";
import { Camera, Map } from "@maplibre/maplibre-react-native";
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
        return (<Map mapStyle="https://demotiles.maplibre.org/style.json" >
            <Camera
                zoom={12}
                center={[location!.coords.longitude, location!.coords.latitude]}
            >

            </Camera>
        </Map>)
    } else if (location) {
        text = JSON.stringify(location);
        return (<Text className="font-headline font-bold text-[72px] leading-[84px] text-raices-secondary text-center tracking-tight">
              {text}
    </Text>)
    }
    
}
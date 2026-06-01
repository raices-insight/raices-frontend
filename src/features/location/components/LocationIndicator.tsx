import { CONFIG } from '@/core/config';
import { Text, View } from "@/src/core/ui/tw";
import { Camera, Map, Marker } from "@maplibre/maplibre-react-native";
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
const API_URL = CONFIG.API_URL.replace(":3000",":8080");
const LOCATION_TASK_NAME = 'background-location-task';


export function LocationIndicator(){
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(()=>{
        async function getCurrentLocation(){
            let {status}=await Location.requestForegroundPermissionsAsync();
            let bgResponse=await Location.requestBackgroundPermissionsAsync();
            if (status !== 'granted'|| bgResponse.status!=="granted") {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            await new Promise(resolve=>setTimeout(resolve, 500))
            try{
                let location = await Location.getCurrentPositionAsync({});
                // console.log("latlng",location!.coords.latitude,location!.coords.longitude)
                setLocation(location);
            }
            catch (error){
                console.warn("Retrying location fetch...");
                await new Promise(resolve => setTimeout(resolve, 2000));
                let location = await Location.getCurrentPositionAsync({});
                // console.log("latlng",location!.coords.latitude,location!.coords.longitude)
                setLocation(location);
            }

            // TODO: IT THROWS TaskManager: Task "background-location-task" failed: [TypeError: Network request failed]
            // await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME)
            
        }

        async function getBackgroundLocation(){
            let {status}=await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
            }

            await new Promise(resolve=>setTimeout(resolve, 2000))
            let location = await Location.getCurrentPositionAsync({});
            
            setLocation(location);
        }

        getCurrentLocation();
    


        

        
    },[])
    if (errorMsg) {
        return null;
    }

    if (location) {
        return (
            <View style={{height:300,width:300}}>
                <Map mapStyle={"https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json"} >
                    <Camera
                        zoom={16}
                        center={[location!.coords.longitude, location!.coords.latitude]}
                    >
                        
                    </Camera>
                    <Marker lngLat={[location!.coords.longitude, location!.coords.latitude]}>
                        <Text className="font-bold text-[24px]">
                            !
                        </Text>
                    </Marker>
                </Map>
            </View>
)
        
    }
    
}
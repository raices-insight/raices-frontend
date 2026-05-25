import { Text, View } from "@/src/core/ui/tw";
import { Camera, Map, Marker } from "@maplibre/maplibre-react-native";
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useState } from 'react';
import { CONFIG } from '@/core/config';
const API_URL = CONFIG.API_URL.replace(":3000",":8080");
const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        // Error occurred - check `error.message` for more details.
        console.error("error in define task")
        return;
    }
    if (data) {
        console.log("enter define task")
        const { locations } = data as any;
        console.log(JSON.stringify(locations))
        let location = locations[locations.length-1]
        await fetch(`${API_URL}/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "latitude": location?.coords.latitude, "longitude": location?.coords.longitude }),
        });

        // do something with the locations captured in the background
    }
});
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
                console.log("latlng",location!.coords.latitude,location!.coords.longitude)
                setLocation(location);
            }
            catch (error){
                console.warn("Retrying location fetch...");
                await new Promise(resolve => setTimeout(resolve, 2000));
                let location = await Location.getCurrentPositionAsync({});
                console.log("latlng",location!.coords.latitude,location!.coords.longitude)
                setLocation(location);
            }

            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME)
            
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
                        <Text className="font-bold text-[24px]">
                            !
                        </Text>
                    </Marker>
                </Map>
            </View>
)
        
    }
    
}
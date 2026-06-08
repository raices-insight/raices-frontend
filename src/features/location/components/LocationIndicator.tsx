import { CONFIG } from '@/core/config';
import { Text, View } from "@/src/core/ui/tw";
import { useWebSocket } from '@/src/core/websocket/websocket-provider';
import { Camera, Map, Marker } from "@maplibre/maplibre-react-native";
import { useEffect, useState } from 'react';
const API_URL = CONFIG.API_URL
const LOCATION_TASK_NAME = 'background-location-task';


export function LocationIndicator(){
    const socket=useWebSocket()
    
   
    
    const [location, setLocation] = useState<{longitude:number,latitude:number}>({
        longitude:0,
        latitude:0
    });
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    socket.subscribe("location.track.update",(data:{longitude:number,latitude:number})=>{
      if (data.longitude!=0 && data.latitude!=0){
        setLocation(data) 
      } 
    })

    
    useEffect(()=>{
        async function getCurrentLocation(){
            
            
        }

       

        getCurrentLocation();
    


        

        
    },[])
    if (errorMsg) {
        return null;
    }

    if (location) {
        return (
            //enginer
            <View style={{height:300,width:300,overflow:"hidden"}} className="flex">
                <Map mapStyle={"https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json"} >
                    <Camera
                        zoom={16}
                        center={[location.longitude, location.latitude]}
                    >
                        
                    </Camera>
                    <Marker lngLat={[location.longitude, location.latitude]} >
                        <Text className="font-bold text-[24px]">
                            📍
                        </Text>
                    </Marker>
                </Map>
            </View>
)
        
    }
    
}
import { CONFIG } from '@/core/config';
import { apiClient } from '@/src/core/api/client';
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
        async function getLatestLocation(){
            const response=await apiClient.get("/location")
            const data = response.data
            console.log("first fetch data ",response.status)
            setLocation({
                longitude: data.longitude,
                latitude: data.latitude
            })
            
        }

       

        getLatestLocation();
    


        

        
    },[])
    if (errorMsg) {
        return null;
    }

    if (location) {
        if (location.latitude==0&&location.longitude==0){
            return (<View>
                <Text>
                No hay ubicación reportada recientemente
            </Text>
            </View>)
        }
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
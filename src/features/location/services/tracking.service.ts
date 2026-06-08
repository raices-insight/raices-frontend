import { CONFIG } from '@/core/config';
import { apiClient } from '@/src/core/api/client';

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
const API_URL = CONFIG.API_URL
export const LOCATION_TASK_NAME = 'background-location-task';

const PSYCHO_TRACK_INTERVAL = 3 * 60 * 1000;

const RELAX_TRACK_INTERVAL = 30 * 60 * 1000;

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
            if (error) {
                // Error occurred - check `error.message` for more details.
                console.error("error in define task: ",error.message)
                return;
            }
            if (data) {
                console.log("dataa ",data)
                // console.log("enter define task")
                const { locations } = data as any;
                // console.log(JSON.stringify(locations))
                let location = locations[locations.length-1]
                let coords={
                    latitude: location?.coords.latitude,
                    longitude: location?.coords.longitude
                }
                console.log("coordinates reported: ",JSON.stringify(coords))
                // TODO: Temporarily disabled because it throws "Network request failed"

                try{
                    await apiClient.post("/location",coords)
                }
                catch(e){
                    console.error("lol lmao ",e)
                }
                // await fetch(`${API_URL}/location`, {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ "latitude": location?.coords.latitude, "longitude": location?.coords.longitude }),
                // });
        
            }
        });


export async function getCurrentLocation() {
    const taskRunning=await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)
    if (taskRunning){
        return;
    }
    console.log("is task registered",
        await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)
    );
    let obtainedLocation: Location.LocationObject;
    let { status } = await Location.requestForegroundPermissionsAsync();
    let bgResponse = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted' || bgResponse.status !== "granted") {
        console.log('Permission to access location was denied');
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 500))
    try {
        let location = await Location.getCurrentPositionAsync({});
        // console.log("latlng",location!.coords.latitude,location!.coords.longitude)
        obtainedLocation = location;
    }
    catch (error) {
        console.warn("Retrying location fetch...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        let location = await Location.getCurrentPositionAsync({});
        // console.log("latlng",location!.coords.latitude,location!.coords.longitude)
        obtainedLocation = location;
    }


    // TODO: IT THROWS TaskManager: Task "background-location-task" failed: [TypeError: Network request failed]
    await startRelaxLocationTracking()

    console.log("are updates actually running",
        await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)
    );

}

export async function startPsychoLocationTracking(){
    await stopTrackingLocation()
    console.log("using psycho tracking")
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME,
        {
            accuracy: Location.Accuracy.Highest,
            distanceInterval: 20,
            timeInterval: 5000,
            foregroundService: {
                notificationTitle: 'Location Tracking',
                notificationBody: 'Tracking location in background',
            },
        })
}

export async function startRelaxLocationTracking(){
    await stopTrackingLocation()
    console.log("using relax tracking")
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME,
        {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 20,
            timeInterval: RELAX_TRACK_INTERVAL,
            foregroundService: {
                notificationTitle: 'Location Tracking',
                notificationBody: 'Tracking location in background',
            },
        })
}

export async function stopTrackingLocation(){
    if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)){
        console.log("stopping location tracking")
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
    }
    
}

export class LocationTrackingService{
    constructor(){
        
    }


    
    
    // async getBackgroundLocation() {
    //     let obtainedLocation:Location.LocationObject;
    //     let { status } = await Location.requestForegroundPermissionsAsync();
    //     if (status !== 'granted') {
    //         console.log('Permission to access location was denied');
    //         return;
    //     }

    //     await new Promise(resolve => setTimeout(resolve, 2000))
    //     let location = await Location.getCurrentPositionAsync({});

    //     obtainedLocation = location;
    // }
}
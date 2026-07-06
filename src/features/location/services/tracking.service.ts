import { apiClient } from "@/src/core/api/client";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

export const LOCATION_TASK_NAME = "background-location-task";
const PSYCHO_TRACK_INTERVAL = 0.1 * 60 * 1000;
const RELAX_TRACK_INTERVAL = 0.1 * 60 * 1000;

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.error("error in define task: ", error.message);
    return;
  }
  if (data) {
    // console.log("enter define task")
    const { locations } = data as any;
    // console.log(JSON.stringify(locations))
    let location = locations[locations.length - 1];
    let coords = {
      latitude: location?.coords.latitude,
      longitude: location?.coords.longitude,
    };
    //console.log("coordinates reported: ", JSON.stringify(coords));
    // TODO: Temporarily disabled because it throws "Network request failed"

    try {
      await apiClient.post("/location", coords);
    } catch (e) {
      console.warn("lol lmao ", e);
    }
  }
});

export type LocationStartResult = 'started' | 'already-running' | 'permission-denied';

export async function getCurrentLocation(): Promise<LocationStartResult> {
  const taskRunning =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (taskRunning) {
    return 'already-running';
  }
  console.log(
    "is task registered",
    await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME),
  );
  let { status } = await Location.requestForegroundPermissionsAsync();
  let bgResponse = await Location.requestBackgroundPermissionsAsync();
  if (status !== "granted" || bgResponse.status !== "granted") {
    console.log("Permission to access location was denied");
    return 'permission-denied';
  }

  await startRelaxLocationTracking();

  console.log(
    "are updates actually running",
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME),
  );
  return 'started';
}

export async function startPsychoLocationTracking() {
  await stopTrackingLocation();
  console.log("using psycho tracking");
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 20,
    timeInterval: PSYCHO_TRACK_INTERVAL,
    foregroundService: {
      notificationTitle: "Compartiendo ubicación",
      notificationBody: "Tu ubicación se está compartiendo con tu familia",
    },
  });
}

export async function startRelaxLocationTracking() {
  await stopTrackingLocation();
  console.log("using relax tracking");
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
    distanceInterval: 20,
    timeInterval: RELAX_TRACK_INTERVAL,
    foregroundService: {
      notificationTitle: "Compartiendo ubicación",
      notificationBody: "Tu ubicación se está compartiendo con tu familia",
    },
  });
}

export async function stopTrackingLocation() {
  if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)) {
    console.log("stopping location tracking");
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
}

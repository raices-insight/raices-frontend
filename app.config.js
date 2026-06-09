module.exports = {
  "expo": {
    "name": "Raíces",
    "slug": "raices-frontend",
    "version": "0.1.0",
    "orientation": "portrait",
    "icon": "./assets/images/RAICES-ios.png",
    "scheme": "raicesfrontend",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundlerIdentifier": "com.raicesfrontend.app",
      "bundleIdentifier": "com.raicesfrontend.app"
    },
    "android": {
      "usesCleartextTraffic": true,
      "adaptiveIcon": {
        "backgroundColor": "#F0F5EC",
        "foregroundImage": "./assets/images/RAICES-foreground-small-logo.png",
        "monochromeImage": "./assets/images/RAICES-foreground-small-logo.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "googleServicesFile": process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
      "package": "com.raicesfrontend.app",
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "com.googleusercontent.apps.854043985624-83j0qtt90032du6ob54ml25lbps8elpc"
            }
          ],
          "category": [
            "BROWSABLE",
            "DEFAULT"
          ]
        }
      ],
      "permissions": [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_BACKGROUND_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.FOREGROUND_SERVICE_LOCATION",
        "android.permission.FOREGROUND_SERVICE_DATA_SYNC"
      ]
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/RAICES.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/RAICES.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#F0F5EC",
          "dark": {
            "backgroundColor": "#F0F5EC"
          }
        }
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.358066150498-1tep87jf8pbslu1c02pgnj8ljqiacv3k"
        }
      ],
      "expo-web-browser",
      [
        "expo-audio",
        {
          "microphonePermission": "Raíces necesita acceso al micrófono para que puedas responder a los eventos."
        }
      ],
      "expo-asset",
      [
        "expo-location",
        {
          "isAndroidBackgroundLocationEnabled": true
        }
      ],
      "@maplibre/maplibre-react-native",
      [
        "expo-notifications",
        {
          "icon": "./assets/images/RAICES.png",
          "color": "#ffffff"
        }
      ],
      "expo-secure-store",
      "./plugins/with-local-build-id"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas_cedric": {
        "projectId": "2c8c1641-d09a-416f-9c50-5b48a39a9bf4"
      },
      "eas_cucha":{
        "projectId": "336fae6e-145f-448d-bbbf-e7f6449e0c9b"
      },
      //"eas": {
      //  "projectId": "2c8c1641-d09a-416f-9c50-5b48a39a9bf4"
      //}

      // "eas": {
      //   "projectId": "2c8c1641-d09a-416f-9c50-5b48a39a9bf4"
      // }
      "eas": {
        "projectId": "336fae6e-145f-448d-bbbf-e7f6449e0c9b"
      }
    }
  }
};

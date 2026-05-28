# Raíces Frontend (Expo)

This is the frontend application for the Raíces project, built with [Expo](https://expo.dev) and React Native.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your `.env` file (copy from `.env.example`).
3. Start the app:
   ```bash
   npx expo start
   ```

---

## Setting up Push Notifications (Firebase FCM V1)

Because this app uses custom development builds (`expo-dev-client`) and requires reliable background push notifications on physical Android devices, you must configure Firebase Cloud Messaging (FCM V1) if you are cloning this repository.

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (e.g., `Raices App`). Disable Google Analytics if not needed.
3. Click **Create project**.

### 2. Register the Android App
1. On the project overview, click the **Android icon**.
2. **Android package name:** Enter `com.raicesfrontend.app` (must match the `package` in `app.json`).
3. Click **Register app**.

### 3. Add `google-services.json`
1. Click **Download google-services.json**.
2. Place this file in the root of the `raices-frontend` directory.
3. Ensure your `app.json` references it:
   ```json
   "android": {
     "googleServicesFile": "./google-services.json",
     "package": "com.raicesfrontend.app"
   }
   ```
*(Note: Do not manually edit `build.gradle` files. Expo handles all native Firebase plugin injections automatically during the EAS build process).*

### 4. Upload Credentials to Expo (EAS)
Expo's servers need permission to deliver notifications to your Firebase project.
1. In Firebase Console > Project settings (Gear Icon) > **Service accounts**.
2. Click **Generate new private key** to download a `.json` file containing your credentials.
3. Open your terminal in `raices-frontend` and run:
   ```bash
   npx eas-cli credentials
   ```
4. Choose **Android** -> **development** (or production).
5. Choose **Manage your Google Service Account Key for Push Notifications (FCM V1)**.
6. Choose **Set up a Google Service Account Key** and provide the path to the `.json` file you downloaded.

### 5. Rebuild the Dev Client
Adding Firebase modifies native Android code. You must rebuild the app:
```bash
npx eas-cli build --profile development --platform android
```
Once installed on your device, `expo-notifications` will successfully generate Push Tokens.

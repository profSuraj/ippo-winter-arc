# IPPO × Winter Arc — Native App

Expo / React Native Android + iOS app for the IPPO 30-day Winter Arc.

## Included
- 30-day workout tracker
- Reel posting tracker
- Local/offline persistence
- Custom exercises and sets
- Height/weight profile
- Water tracker with custom target
- Breakfast/lunch/snack/dinner log
- Daily motivation + Bollywood soundtrack suggestion
- Native daily workout notification
- Android APK build profile
- iOS production/TestFlight build profile

## Run locally

```bash
cd mobile
npm install
npx expo start
```

Before an EAS build, run:

```npx expo install --check
npx expo-doctor
```

Expo recommends using Expo's installer/checker to keep SDK-managed package versions compatible. SDK 56 uses React Native 0.85. 

## Android APK

```bash
npx eas-cli login
npx eas build -p android --profile preview
```

The preview profile is configured to produce an installable APK.

## iOS

```bash
npx eas build -p ios --profile production
```

An iOS device build requires Apple signing and is normally distributed through TestFlight/App Store.

## Data

The first native version is offline-first. Progress is stored locally with AsyncStorage. No account or backend is required.

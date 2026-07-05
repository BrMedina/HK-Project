# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Home screen widget

- `src/widget/QuickAddWidget.jsx` — the widget's visual layout (today's spend,
  budget left, an "Add expense" tap target). Pure presentation, no data fetching.
- `src/widget/widget-task-handler.js` — runs when the widget is added, updated,
  resized, or tapped. Pulls totals from the existing database (`src/db/queries`)
  and the currency module (`src/api/currency.ts`), then either re-renders
  the widget or opens the app via deep link.
- Register a `galafund://add` deep link in the app's navigation so tapping the
  widget lands directly on Add Expense, not the dashboard.
- Android widgets can't reliably host a real text input, so the widget itself
  is view-only plus one button — the actual typing still happens in the app,
  just one tap away instead of several.
- Requires native code: run `npx expo prebuild` then `npx expo run:android`.
  Expo Go will not show the widget.
- `getActiveTripId()` fetches the active trip (falls back to trips[0] or null).

## Share-to-app receipt logging

- `src/share/ShareReceiveScreen.jsx` — reached when the user shares an image
  into Gala Fund from Android's share sheet (e.g. after screenshotting a
  GCash receipt). Runs the existing ML Kit OCR + `receiptParser.js` on the
  shared image, shows a pre-filled confirm screen, and saves via `addExpense`
  with `source: "share"`.
- Uses `expo-share-intent`, which registers the app as an image share target
  and redirects into the app automatically — no custom Android manifest work
  needed beyond the plugin config.
- No overlay permission, no screen-capture permission — this only ever
  touches an image the user explicitly chose to share.
- Requires native code: `npx expo prebuild` then `npx expo run:android`.
  Expo Go will not show Gala Fund in the Android share sheet.


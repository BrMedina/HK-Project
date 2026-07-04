Add QR scanning and receipt OCR to the "Gala Fund" app inside `frontend/src/scanner/`. This is on-device camera + ML Kit functionality — no server, no external API calls. It uses VisionCamera (current v5/Nitro architecture) for the camera, a dedicated barcode-scanner plugin for QR codes, and ML Kit Text Recognition for receipt OCR.

Note: like the existing WatermelonDB setup in `frontend/`, this requires native code, so **Expo Go will not work** — a dev client build is required (`npx expo prebuild` + `npx expo run:android`).

## Add these dependencies to frontend/package.json
```json
{
  "react-native-vision-camera": "^5.0.0",
  "react-native-nitro-modules": "^0.20.0",
  "react-native-nitro-image": "^1.0.0",
  "react-native-vision-camera-barcode-scanner": "^1.0.0",
  "@react-native-ml-kit/text-recognition": "^2.0.0"
}
```

## Add this plugin entry to frontend/app.json (inside "expo.plugins")
```json
[
  "react-native-vision-camera",
  {
    "cameraPermissionText": "Gala Fund needs camera access to scan merchant QR codes and receipts."
  }
]
```

## frontend/src/scanner/emvQrParser.js
```js
// Parses GCash / QR PH payment QR codes, which follow the EMVCo TLV
// (tag-length-value) format: each field is a 2-digit tag, 2-digit length,
// then that many characters of value.
export function parseEMVQR(payload) {
  const fields = {};
  let i = 0;
  while (i < payload.length - 4) {
    const tag = payload.substr(i, 2);
    const len = parseInt(payload.substr(i + 2, 2), 10);
    if (Number.isNaN(len)) break;
    const value = payload.substr(i + 4, len);
    fields[tag] = value;
    i += 4 + len;
  }

  return {
    merchantName: fields["59"] || null,
    merchantCity: fields["60"] || null,
    countryCode: fields["58"] || null,
    raw: fields,
  };
}
```

## frontend/src/scanner/receiptParser.js
```js
// Extracts amount, reference number, and date from OCR'd receipt/screenshot text.
// This is best-effort pattern matching — always show the result to the user
// for confirmation before saving, since OCR + regex won't be 100% reliable.
export function parseReceiptText(text) {
  const amountMatch = text.match(/(?:₱|PHP)\s?([\d,]+\.\d{2})/i);
  const refMatch = text.match(/ref(?:erence)?\.?\s?(?:no\.?)?[:\s]*([A-Z0-9]{6,})/i);
  const dateMatch = text.match(/(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/);

  return {
    amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : null,
    referenceNumber: refMatch ? refMatch[1] : null,
    date: dateMatch ? dateMatch[1] : null,
    rawText: text,
  };
}
```

## frontend/src/scanner/QRScannerScreen.js
```jsx
import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { CodeScanner } from "react-native-vision-camera-barcode-scanner";
import { parseEMVQR } from "./emvQrParser";

// onScanned receives { merchantName, merchantCity, countryCode, raw }
export default function QRScannerScreen({ onScanned }) {
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  if (!device || !hasPermission) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera access…</Text>
      </View>
    );
  }

  return (
    <CodeScanner
      style={StyleSheet.absoluteFill}
      device={device}
      isActive
      codeTypes={["qr"]}
      onCodeScanned={(codes) => {
        if (codes.length === 0) return;
        const parsed = parseEMVQR(codes[0].value);
        onScanned(parsed);
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
```

## frontend/src/scanner/ReceiptScannerScreen.js
```jsx
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { parseReceiptText } from "./receiptParser";

// onScanned receives { amount, referenceNumber, date, rawText }
export default function ReceiptScannerScreen({ onScanned }) {
  const camera = useRef(null);
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  const capture = async () => {
    if (!camera.current || processing) return;
    setProcessing(true);
    try {
      const photo = await camera.current.takePhoto({ flash: "off" });
      const result = await TextRecognition.recognize(`file://${photo.path}`);
      onScanned(parseReceiptText(result.text));
    } finally {
      setProcessing(false);
    }
  };

  if (!device || !hasPermission) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera access…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera ref={camera} style={StyleSheet.absoluteFill} device={device} isActive photo />
      <TouchableOpacity style={styles.shutter} onPress={capture} disabled={processing}>
        <Text style={styles.shutterText}>{processing ? "Reading…" : "Scan Receipt"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  shutter: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#2FBF71",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  shutterText: { color: "#101820", fontWeight: "600" },
});
```

## frontend/README.md — append this section
```md
## Scanning (QR + Receipt OCR)

- `src/scanner/QRScannerScreen.js` — live camera QR scanner for merchant payment
  QR codes. Parses the EMVCo payload to pull out merchant name/city, then hands
  that to `onScanned` so the caller can pre-fill an add-expense form.
- `src/scanner/ReceiptScannerScreen.js` — one-shot photo capture + ML Kit text
  recognition for receipts/screenshots. Extracts amount, reference number, and
  date via `receiptParser.js`, then hands the result to `onScanned`.
- Both require camera permission (declared via the `react-native-vision-camera`
  Expo config plugin in `app.json`) and native code, so run
  `npx expo prebuild && npx expo run:android` after installing — Expo Go
  will not work here, same as the WatermelonDB setup.
- Neither screen saves anything itself — wire `onScanned` to the existing
  `addExpense` query helper so scanned data flows into the same database as
  manual entries, tagged with `source: "qr"` or `source: "ocr"`.
- Always show the parsed result to the user for confirmation/edit before
  saving — OCR and QR parsing are best-effort, not guaranteed accurate.
```

After adding these files, install the new dependencies, add the config plugin, run `npx expo prebuild`, and confirm the app builds with `npx expo run:android`.

import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { parseReceiptText } from "./receiptParser";

let TextRecognition = null;
if (Platform.OS !== "web") {
  try {
    TextRecognition = require("@react-native-ml-kit/text-recognition").default;
  } catch (e) {
    console.warn("ML Kit modules not loaded:", e.message);
  }
}

export default function ReceiptScannerScreen({ onScanned }) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const capture = async () => {
    if (!cameraRef.current || processing || !TextRecognition) return;
    setProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync();
      const result = await TextRecognition.recognize(photo.uri);
      onScanned({
        ...parseReceiptText(result.text),
        source: "ocr"
      });
    } catch (err) {
      console.error("Text recognition error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleSimulate = () => {
    const text = "MERCHANT: STARBUCKS COFFEE\nREF NO: SBX987654321\nTOTAL AMOUNT: PHP 285.50\nDATE: 04/07/2026";
    const parsed = parseReceiptText(text);
    onScanned({
      ...parsed,
      note: "Starbucks Coffee",
      source: "ocr"
    });
  };

  if (!permission) {
    return <View style={styles.center} />;
  }

  if (!permission.granted || !TextRecognition) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Receipt OCR scanner not available.</Text>
        <Text style={styles.subText}>Use dev client build on real device to test live camera OCR.</Text>
        {!permission.granted && (
          <TouchableOpacity style={[styles.demoBtn, { marginBottom: 16 }]} onPress={requestPermission}>
            <Text style={styles.demoBtnText}>Allow Camera</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.demoBtn} onPress={handleSimulate}>
          <Text style={styles.demoBtnText}>Simulate Receipt OCR (Starbucks - ₱285.50)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />
      <TouchableOpacity style={styles.shutter} onPress={capture} disabled={processing}>
        <Text style={styles.shutterText}>{processing ? "Reading…" : "Scan Receipt"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#f8f9ff" },
  infoText: { fontSize: 16, fontWeight: "600", color: "#181c23", textAlign: "center", marginBottom: 8 },
  subText: { fontSize: 13, color: "#717786", textAlign: "center", marginBottom: 24 },
  demoBtn: { backgroundColor: "#2FBF71", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  demoBtnText: { color: "#101820", fontWeight: "700", fontSize: 14 },
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

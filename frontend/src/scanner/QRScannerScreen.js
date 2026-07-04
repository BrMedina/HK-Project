import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable, Platform } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { parseEMVQR } from "./emvQrParser";

export default function QRScannerScreen({ onScanned }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned || !data) return;
    setScanned(true);
    const parsed = parseEMVQR(data);
    onScanned({
      ...parsed,
      amount: parsed.raw?.["54"] ? parseFloat(parsed.raw["54"]) : null,
      source: "qr",
    });
    // Reset scanned state after a delay if they stay on screen
    setTimeout(() => setScanned(false), 2000);
  };

  const simulate = () => {
    const payload = "00020101021130540010COM.GCASH.MC0208123456785204599953036085406125.005802PH5918Convenience Store6006Manila62070703***6304ABCD";
    const parsed = parseEMVQR(payload);
    onScanned({ ...parsed, amount: 125.00, source: "qr" });
  };

  if (!permission) {
    return <View style={s.center} />;
  }

  if (!permission.granted) {
    return (
      <View style={s.center}>
        <Text style={s.info}>No access to camera</Text>
        <Text style={s.sub}>Please grant camera permission to scan QR codes.</Text>
        <Pressable style={s.btn} onPress={requestPermission}>
          <Text style={s.btnText}>Allow Camera</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === 'web' ? (
        <View style={s.center}>
          <Text style={s.info}>Web camera not fully supported</Text>
          <Pressable style={s.btn} onPress={simulate}>
            <Text style={s.btnText}>Simulate GCash QR Scan</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <CameraView
            style={StyleSheet.absoluteFill}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
          <View style={s.overlay}>
            <View style={s.frame} />
            <Text style={s.hint}>Point at a QR PH / GCash code</Text>
          </View>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#f8f9ff" },
  info: { fontSize: 16, fontWeight: "600", color: "#181c23", textAlign: "center", marginBottom: 8 },
  sub: { fontSize: 13, color: "#717786", textAlign: "center", marginBottom: 24 },
  btn: { backgroundColor: "#007dfe", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", gap: 20 },
  frame: { width: 220, height: 220, borderWidth: 2, borderColor: "#fff", borderRadius: 16 },
  hint: { color: "#fff", fontWeight: "600", fontSize: 14, textShadowColor: "#000", textShadowRadius: 4 },
});

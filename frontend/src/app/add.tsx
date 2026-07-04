import React from "react";
import { Redirect } from "expo-router";

// ponytail: direct redirect path for galafund://add deep link
export default function AddRedirect() {
  return <Redirect href="/scan?mode=manual" />;
}

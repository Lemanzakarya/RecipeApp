import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  ActivityIndicator,
  DimensionValue,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

export type ImageWithFallbackProps = {
  uri?: string | null;
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  contentFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  placeholderColor?: string;
};

export default function ImageWithFallback({
  uri,
  width = 64,
  height = 64,
  borderRadius = 12,
  style,
  contentFit = "cover",
  placeholderColor,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const background = useThemeColor({}, "background");
  const icon = useThemeColor({}, "icon");

  const bg =
    placeholderColor ?? (typeof background === "string" ? background : "#eee");

  const iconSize =
    typeof width === "number" && typeof height === "number"
      ? Math.min(width, height) * 0.4
      : typeof height === "number"
      ? height * 0.4
      : 24;

  if (!uri || error) {
    return (
      <View
        style={[
          {
            width,
            height,
            borderRadius,
            backgroundColor: bg,
            alignItems: "center",
            justifyContent: "center",
          },
          style,
        ]}
      >
        <IconSymbol name="photo" color={icon as string} size={iconSize} />
      </View>
    );
  }

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          overflow: "hidden",
          backgroundColor: bg,
        },
        style,
      ]}
    >
      {!loaded && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color={icon as string} />
        </View>
      )}
      <Image
        source={{ uri }}
        style={{ width: "100%", height: "100%" }}
        contentFit={contentFit}
        onError={() => setError(true)}
        onLoadEnd={() => setLoaded(true)}
        transition={200}
      />
    </View>
  );
}

import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

export default function Add({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGallaeryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGallaeryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync({
        base64: true,
        quality: 1,
      });
      setCapturedImage(data.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setCapturedImage(result.uri);
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.camera}
          type={type}
          ratio={"1:1"}
          flashMode={flashMode}
          autoFocus={Camera.Constants.AutoFocus.on}
        />
      </View>

      <Button
        title="Flip"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}
      ></Button>

      <Button
        title="Flash"
        onPress={() => {
          setFlashMode(
            flashMode === Camera.Constants.FlashMode.off
              ? Camera.Constants.FlashMode.torch
              : Camera.Constants.FlashMode.off
          );
        }}
      ></Button>

      <Button title="Capture" onPress={() => takePicture()} />

      <Button title="Pick from Gallery" onPress={() => pickImage()} />

      <Button
        title="Save"
        onPress={() => navigation.navigate("Save", { capturedImage })}
      />

      {capturedImage && (
        <Image source={{ uri: capturedImage }} style={{ flex: 1 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
});

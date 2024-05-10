import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera/next';
import { useRouter } from 'expo-router';

const Scan: React.FC = () => {
  const barcodeTypes = [
    'aztec',
    'ean13',
    'ean8',
    'qr',
    'pdf417',
    'upc_e',
    'datamatrix',
    'code39',
    'code93',
    'itf14',
    'codabar',
    'code128',
  ];
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  const onCancelPress = () => {
    router.replace('/search');
  };

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <CameraView
        flash="on"
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: barcodeTypes,
        }}
        onBarcodeScanned={(scanningResult) => {
          const data = scanningResult.data;
          console.log('data', data);
          router.replace({ pathname: '/search', params: { searchTerm: data } });
        }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onCancelPress}>
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
  },
  camera: {
    marginTop: 50,
    flex: 0.9,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'transparent',
    padding: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Scan;

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import WebView from 'react-native-webview';

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
  const webviewRef = useRef<WebView>();
  const alreadySent = new Map();

  const sendMessage = (data: string) => {
    if (webviewRef.current) {
      if (!alreadySent.has(data)) {
        alreadySent.set(data, null);
        webviewRef.current.postMessage(data);
        console.log('sent data to webview', data);
      }
    }
  };

  const onMessage = (event: any) => {
    console.log('message from webview', event.nativeEvent.data);
  };

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
          barcodeTypes,
        }}
        onBarcodeScanned={(scanningResult) => {
          const data = scanningResult.data;
          sendMessage(data);
          // router.replace({ pathname: '/search', params: { searchTerm: data } });
        }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onCancelPress}>
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <WebView ref={webviewRef} source={require('./sample.html')} onMessage={onMessage} />
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
    flex: 0.5,
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

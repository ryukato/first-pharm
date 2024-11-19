import React, { useRef } from 'react';
import { WebView } from 'react-native-webview';

const MyWebView: React.FC = () => {
  const webviewRef = useRef<WebView>();

  return (
    <WebView
      ref={webviewRef}
      source={require('./sample.html')}
      injectedJavaScript={`window.postMessage(${JSON.stringify({ message: 111 })}, '*');`}
    />
  );
};

export default MyWebView;

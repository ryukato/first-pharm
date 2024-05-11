import { Dimensions, Platform, ScaledSize } from 'react-native';

export function isIPhoneX() {
  const dim = Dimensions.get('window');

  return (
    // This has to be iOS
    Platform.OS === 'ios' &&
    // Check either, iPhone X or XR
    (isIPhoneXSize(dim) || isIPhoneXrSize(dim))
  );
}

export function isIPhoneXSize(dimensions: ScaledSize) {
  return dimensions.height === 812 || dimensions.width === 812;
}

export function isIPhoneXrSize(dimensions: ScaledSize) {
  return dimensions.height === 896 || dimensions.width === 896;
}

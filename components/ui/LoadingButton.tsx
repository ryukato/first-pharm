import Ionicons from '@expo/vector-icons/Ionicons';
import React, { CSSProperties } from 'react';
import { ActivityIndicator, TouchableOpacity, Text } from 'react-native';

export type Props = {
  title: string;
  iconName: string;
  isLoading: boolean;
  style: CSSProperties;
  onPress: () => void;
};

const LoadingButton: React.FC<Props> = ({ title, iconName, isLoading, style, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: '90%',
          height: 40,
          borderWidth: 1,
          borderColor: '#DDE1E2',
          borderRadius: 25,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(90, 154, 230, 1)',
        },
        style,
      ]}>
      {!isLoading ? (
        <Ionicons name={iconName} size={20} color="#fff" style={{ marginRight: 5 }} />
      ) : (
        <ActivityIndicator size="small" color="#fff" style={{ marginRight: 5 }} />
      )}
      <Text style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default LoadingButton;

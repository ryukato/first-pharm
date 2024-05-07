import { forwardRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonProps = {
  onPress?: TouchableOpacityProps['onPress'];
  title?: string;
  color: string;
  customStyle?: any;
} & TouchableOpacityProps;

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
  ({ onPress, title, customStyle, color }, ref) => {
    return (
      <TouchableOpacity ref={ref} style={[styles.button, customStyle]} onPress={onPress}>
        <Text style={[styles.buttonText, { color: color }]}>{title}</Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#eeeef0',
    borderStyle: 'solid',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

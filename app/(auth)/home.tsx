import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image } from 'react-native';

const Home: React.FC = () => {
  return (
    <View style={styles.container}>
      <TextInput style={styles.searchInput} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderColor: '#000',
  },
  searchInput: {
    width: '100%',
    borderWidth: 0.2,
    borderColor: '#6c47ff',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default Home;

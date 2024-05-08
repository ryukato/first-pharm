import { SearchBar, Button } from '@rneui/themed';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import _ from 'lodash';

const Search: React.FC = () => {
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = _.debounce((searchTerm: string) => {
    try {
      console.log('do search with ', searchTerm);
    } finally {
      setSearching(false);
    }
  }, 2000);
  const onSearchContentChangeHandler = useCallback((newVal: string) => {
    setSearch(newVal);
    if (newVal && newVal.length > 1 && !searching) {
      setSearching(true);
      handleSearch(newVal);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          containerStyle={styles.searchBar}
          inputContainerStyle={styles.searchBarInputContainer}
          leftIconContainerStyle={styles.leftIconContainerStyle}
          rightIconContainerStyle={styles.rightIconContainerStyle}
          lightTheme
          round
          showCancel
          showLoading={searching}
          placeholder="Type Here..."
          value={search}
          onChangeText={onSearchContentChangeHandler}
        />
        <Button
          icon={{
            name: 'barcode-outline',
            type: 'ionicon',
            size: 35,
            color: '#f50',
          }}
          iconContainerStyle={{ marginLeft: -10 }}
          buttonStyle={{
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          }}
          loadingProps={{ animating: true }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#00000000',
  },

  searchBar: {
    width: '90%',
    borderWidth: 0.1,
    borderRadius: 15,
    backgroundColor: '#00000000',
  },
  searchBarInputContainer: {
    backgroundColor: '#fff',
  },
  leftIconContainerStyle: {
    backgroundColor: '#fff',
  },
  rightIconContainerStyle: {
    backgroundColor: '#fff',
  },
});

export default Search;

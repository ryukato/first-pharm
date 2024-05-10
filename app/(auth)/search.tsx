import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, SearchBar } from '@rneui/base';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ProductList from '~/components/ProductList';

import MediProductApiClient from '~/utils/openapi/medi-product-query-api-client';

const Search: React.FC = () => {
  // this is just for testing, please remove the init value once testing is done
  const [search, setSearch] = useState('8806718073525');
  const [searching, setSearching] = useState(false);
  const [searchBarPlaceHolder, setSearchBarPlaceHolder] = useState('Please type to search');
  const { searchTerm } = useLocalSearchParams<{ searchTerm: string }>();
  const [productList, setProductList] = useState([]);

  useMemo(() => {
    // this is to handle data from scanning, and the data has to be number
    if (searchTerm && searchTerm.length > 6 && !isNaN(Number(searchTerm))) {
      setSearch(searchTerm);
    } else if (searchTerm && searchTerm.length > 1) {
      console.warn('Invalid data for searching, data=', searchTerm);
      setSearchBarPlaceHolder("Invalid code scan, can't search it");
    }
  }, []);

  const onSearchButtonPress = async () => {
    setSearching(true);

    const apiClient = new MediProductApiClient();
    let prodList = null;
    try {
      if (isNaN(Number(search))) {
        prodList = await apiClient.findByName(search);
      } else {
        prodList = await apiClient.findByBarcode(search);
      }
      console.debug('product-information', JSON.stringify(prodList));
      setProductList(prodList);
    } catch (error: any) {
      console.error('Fail to search product, error', JSON.stringify(error));
      alert('Fail to search');
    } finally {
      setSearching(false);
    }
  };

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
          placeholder={searchBarPlaceHolder}
          value={search}
          onChangeText={(text: string) => {
            setSearch(text);
          }}
        />
        <Link replace href="/scan">
          <Ionicons name="barcode-outline" size={28} color="#f50" />
        </Link>
      </View>
      <View style={{ flexDirection: 'row', padding: 5, justifyContent: 'center' }}>
        <Button
          onPress={onSearchButtonPress}
          loading={searching}
          title="Search"
          icon={{
            name: 'search',
            type: 'ionicons',
            size: 15,
            color: 'white',
          }}
          iconContainerStyle={{ marginRight: 10 }}
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={{
            backgroundColor: 'rgba(90, 154, 230, 1)',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 30,
          }}
          containerStyle={{
            width: '80%',
          }}
        />
      </View>
      {productList.length > 0 && <ProductList list={productList} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  searchBarContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000000',
  },

  searchBar: {
    width: '90%',
    borderWidth: 0.1,
    borderRadius: 15,
    backgroundColor: '#00000000',
    borderTopWidth: 0,
    borderBottomWidth: 0,
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

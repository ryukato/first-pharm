import Ionicons from '@expo/vector-icons/Ionicons';
import { SearchBar } from '@rneui/base';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import ProductList from '~/components/ProductList';
import LoadingButton from '~/components/ui/LoadingButton';
import { MediProductModel } from '~/models/models';
import { isIPhoneX } from '~/utils/device';
import { apiClient } from '~/utils/openapi/medi-product-query-api-client';

const Search: React.FC = () => {
  // this is just for testing, please remove the init value once testing is done
  const [search, setSearch] = useState('8806718073525');
  const [searching, setSearching] = useState(false);
  const [searchBarPlaceHolder, setSearchBarPlaceHolder] = useState('Please type to search');
  const { searchTerm } = useLocalSearchParams<{ searchTerm: string }>();
  const [productList, setProductList] = useState<MediProductModel[]>([]);
  const [page, setPage] = useState(1);

  useMemo(() => {
    // this is to handle data from scanning, and the data has to be number
    if (searchTerm && searchTerm.length > 6 && !isNaN(Number(searchTerm))) {
      setSearch(searchTerm);
    } else if (searchTerm && searchTerm.length > 1) {
      console.warn('Invalid data for searching, data=', searchTerm);
      setSearchBarPlaceHolder("Invalid code scan, can't search it");
    }
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const onMoreButtonPressHandler = async () => {
    setSearching(true);
    try {
      const list = await doSearch(page + 1);
      if (list && list.length > 1) {
        setPage(page + 1);
        setProductList(productList.concat(list));
      }
    } catch (error: any) {
      console.error('Fail to search prouct, error', JSON.stringify(error));
      alert('Fail to search');
    } finally {
      setSearching(false);
    }
  };

  const onSearhButtonPressHandler = async () => {
    if (!search || search.length < 1) {
      alert('Please input search');
      return;
    }
    setProductList([]);
    setSearching(true);
    try {
      const list = await doSearch(page);
      setProductList(list);
    } catch (error: any) {
      console.error('Fail to search prouct, error', JSON.stringify(error));
      alert('Fail to search');
    } finally {
      setSearching(false);
    }
  };
  const doSearch = async (pageNo: number): Promise<MediProductModel[]> => {
    if (isNaN(Number(search))) {
      return await apiClient.findByName(search, {
        pageNo,
      });
    } else {
      return await apiClient.findByBarcode(search, {
        pageNo,
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgrounColor: '#fff' }}>
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
          <LoadingButton
            title="Search"
            onPress={onSearhButtonPressHandler}
            isLoading={searching}
            style={{ width: '90%' }}
            iconName="search-outline"
          />
        </View>
        <View style={{ flex: 1 }}>
          {productList.length > 0 && <ProductList list={productList} />}
        </View>
      </View>
      {productList && productList.length > 0 && (
        <View
          style={[
            styles.buttonContainer,
            { flexDirection: 'row', justifyContent: 'center', padding: 10 },
          ]}>
          <LoadingButton
            title="More"
            onPress={onMoreButtonPressHandler}
            isLoading={searching}
            style={{ width: '50%' }}
            iconName="arrow-down-outline"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  searchBar: {
    width: '90%',
    borderBottomWidth: 0,
    backgroundColor: '#fff',
  },
  searchBarInputContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#DDE1E2',
  },
  leftIconContainerStyle: {
    backgroundColor: '#fff',
  },
  rightIconContainerStyle: {
    backgroundColor: '#fff',
  },
  buttonContainer: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    bottom: 30,
    backgroundColor: 'white',
    paddingVertical: 8,
    marginBottom: isIPhoneX() ? 16 : 0,
  },
});

export default Search;

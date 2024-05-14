import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView, TextInput } from 'react-native';

import ProductList from '~/components/ProductList';
import LoadingButton from '~/components/ui/LoadingButton';
import { MediProductModel } from '~/models/models';
import { isIPhoneX } from '~/utils/device';
import { apiClient } from '~/utils/openapi/medi-product-query-api-client';
import { SearchedProductList } from '~/utils/openapi/types';

const Search: React.FC = () => {
  // this is just for testing, please remove the init value once testing is done
  const [search, setSearch] = useState('8806718073525');
  const [searching, setSearching] = useState(false);
  const [searchBarPlaceHolder, setSearchBarPlaceHolder] = useState('Please type to search');
  const { searchTerm } = useLocalSearchParams<{ searchTerm: string }>();
  const [productList, setProductList] = useState<MediProductModel[]>([]);
  const [page, setPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(false);

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
      const { paging, list }: SearchedProductList = await doSearch(page + 1);
      if (paging.pageNo * paging.numOfRows > paging.totalCount) {
        setHasMoreProducts(false);
      }
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
    setSearching(true);
    try {
      const { paging, list }: SearchedProductList = await doSearch(page);
      setProductList(list);
      if (paging.pageNo * paging.numOfRows < paging.totalCount) {
        setHasMoreProducts(true);
      }
    } catch (error: any) {
      setProductList([]);
      console.error('Fail to search prouct, error', JSON.stringify(error));
      alert('Fail to search');
    } finally {
      setSearching(false);
    }
  };
  const doSearch = async (pageNo: number): Promise<SearchedProductList> => {
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

  const ScanButton: React.FC = () => {
    return (
      <Link replace href="/scan">
        <Ionicons name="barcode-outline" size={28} color="#f50" />
      </Link>
    );
  };

  const NoMatchedParagraph: React.FC = () => {
    return (
      <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#DDE1E2' }}>
          No matched product
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <View
              style={[
                styles.searchBarInputContainer,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}>
              <Ionicons
                style={{ marginLeft: 5, marginRight: 5 }}
                name="search-outline"
                size={20}
                color="#DDE1E2"
              />
              <TextInput
                style={{ paddingVertical: 3, fontSize: 16, height: 40 }}
                placeholder={searchBarPlaceHolder}
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </View>
          <ScanButton />
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
        <View style={{ height: '85%' }}>
          {productList && productList.length > 0 ? (
            <ProductList
              list={productList}
              onPressItem={(item) => {
                console.log('selected item', JSON.stringify(item));
              }}
            />
          ) : (
            <NoMatchedParagraph />
          )}
        </View>
      </View>
      {hasMoreProducts && (
        <View
          style={[
            styles.buttonContainer,
            {
              height: '5%',
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              padding: 10,
              backgroundColor: 'transparent',
            },
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
    height: '10%',
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

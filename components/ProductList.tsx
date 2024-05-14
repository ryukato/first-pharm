import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';

import { MediProductModel } from '~/models/models';
import { ParsedXmlContentResolver } from '~/utils/openapi/content-element-resolver';

export type ProductListProps = {
  list: MediProductModel[];
  onPressItem: (item: MediProductModel) => void;
};

const ProductList: React.FC = ({ list, onPressItem }: ProductListProps) => {
  return (
    <>
      <View style={styles.divider} />
      <View style={styles.container}>
        <FlatList
          data={list}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={{ marginTop: 5 }} onPress={() => onPressItem(item)}>
                <View style={styles.listItemContainer}>
                  <Text style={styles.itemTitle}>{item.itemName}</Text>
                  <Text style={styles.itemSubTitle}>({item.entpName})</Text>
                </View>
                {/* <View> */}
                {/*   <Text>{resolvedEffects}</Text> */}
                {/*   <Text>{resolvedUsage}</Text> */}
                {/*   <Text>{resolvedCaution}</Text> */}
                {/* </View> */}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  divider: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '90%',
    height: 3,
    backgroundColor: '#DDE1E2',
  },
  listItemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DDE1E2',
    borderRadius: '15',
  },
  itemTitle: {
    fontSize: 15,
    textAlign: 'left',
  },
  itemSubTitle: {
    fontSize: 11,
    marginTop: 3,
    marginLeft: 5,
  },
});

export default ProductList;

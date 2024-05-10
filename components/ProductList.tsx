import { Divider, ListItem } from '@rneui/base';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';

import { MediProductModel } from '~/models/models';

const ProductList: React.FC = ({ list }: any) => {
  return (
    <GestureHandlerRootView>
      {/* <Divider width={3} color="#757574" inset insetType="middle" /> */}
      <Divider
        style={styles.divider}
        color="#757574"
        insetType="left"
        subHeaderStyle={{}}
        width={2}
        orientation="horizontal"
      />
      <View style={styles.container}>
        {list.map((item: MediProductModel, index: number) => (
          <TouchableOpacity key={index} style={styles.listTouchable} onPress={() => {}}>
            <ListItem topDivider bottomDivider containerStyle={styles.listItemContainer}>
              <ListItem.Content right={false} style={styles.listContent}>
                <View style={styles.contentContainer}>
                  <Text style={styles.itemTitle}>{item.itemName}</Text>
                  <Text style={styles.itemSubTitle}>({item.validTerm})</Text>
                  <Text style={styles.itemSubTitle}>({item.entpName})</Text>
                </View>
              </ListItem.Content>
            </ListItem>
          </TouchableOpacity>
        ))}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  divider: {
    width: '80%',
    marginLeft: 40,
  },
  listTouchable: {
    borderRadius: 15,
  },
  listItemContainer: {
    borderColor: '#ECE9E8',
    borderWidth: 1,
    borderRadius: 15,
  },
  listContent: {
    marginLeft: 40,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 15,
  },
  itemTitle: {
    fontSize: 16,
    marginHorizontal: 3,
  },
  itemSubTitle: {
    fontSize: 11,
    alignSelf: 'flex-end',
    marginLeft: 5,
  },
});

export default ProductList;

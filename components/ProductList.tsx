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
        color="#DDE1E2"
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
                  {/* <Text style={styles.itemSubTitle}>({item.validTerm})</Text> */}
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
    padding: 1,
  },
  listItemContainer: {
    borderColor: '#DDE1E2',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderRadius: 15,
  },
  listContent: {
    padding: 2,
    marginLeft: 10,
    height: 30,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 14,
    textAlign: 'left',
  },
  itemSubTitle: {
    fontSize: 11,
    alignSelf: 'flex-start',
    bottom: -15,
  },
  entpNameLabel: {
    position: 'absolute',
    left: 0,
    bottom: -15,
    fontSize: 12,
  },
});

export default ProductList;

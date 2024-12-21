import React from 'react';
import { View, Text, StyleSheet, Modal, Image, FlatList, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

const DetailsScreen = ({ route, navigation }) => {
  const { item } = route.params;

  const renderImageGrid = (images) => {
    return (
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
        //   <Image source={{ uri: item.image }} style={styles.gridImage} />
        <FastImage
  source={{ uri: item.image }}
  style={styles.gridImage}
  resizeMode={FastImage.resizeMode.cover}
/>

        )}
        numColumns={3}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Machine Details</Text>
      <Text style={styles.detailText}>Machine: {item?.machine}</Text>
      <Text style={styles.detailText}>Temperature: {item?.temperature}</Text>
      <Text style={styles.detailText}>Location: {item?.location}</Text>
      <Text style={styles.detailText}>Date: {item?.date}</Text>
      
      <Text style={styles.headerText}>Images</Text>
      {renderImageGrid(item?.images)}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  detailText: {
    fontSize: 18,
    marginVertical: 5,
  },
  gridImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DetailsScreen;

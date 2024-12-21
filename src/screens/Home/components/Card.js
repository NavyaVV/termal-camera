import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import moment from 'moment';  

const { width } = Dimensions.get('window');

const Card = ({
  machine,
  temperature,
  location,
  date,
  image,
  onPress 
}) => {
 
  const formatDate = (dateStr) => {
    return moment(dateStr).format('DD/MM/YYYY'); 
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={styles.cardComponent}>
      
      <Image 
        source={image ? { uri: image } : require('../../../assets/user.png')} 
        style={styles.image} 
        onError={() => console.log('Failed to load image')} 
      />

      <View style={styles.innerContainer}>
        <Text style={styles.machineText}>{machine}</Text>
        <Text style={styles.nameText}>Temp: {temperature}°C</Text>
      </View>

      <Text style={styles.nameText}>{formatDate(date)}</Text> 
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  cardComponent: {
    width: '100%',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center', 
    backgroundColor: '#fff', 
    elevation: 5,
    paddingTop: 20,
    paddingBottom: 20
  },
  image: {
    width: width * 0.20, 
    height: width * 0.20, 
    resizeMode: 'cover'
  },
  innerContainer: {
    marginLeft: 20,
    flex: 1, 
  },
  nameText: {
    fontSize: 16,
    color: 'rgba(128, 128, 128, 1)',
  },
  machineText: {
    color: 'rgba(71, 71, 71, 1)',
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 10
  }
});

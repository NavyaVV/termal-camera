import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';

const { width } = Dimensions.get('window');

const MachineCard = ({
  machine,
  temperature,
  location,
  description,
  image,
  onPress
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.cardComponent}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.machineText}>{machine}</Text>

        </View>

        <View style={styles.line} />
        <View style={styles.footer}>
        <Text style={styles.temperatureText}>Location</Text>
        <Text style={styles.temperatureText}>{location}</Text>
        </View>
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{description}</Text>

      
      </View>
      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}
    </TouchableOpacity>
  );
};

export default MachineCard;

const styles = StyleSheet.create({
  cardComponent: {
    width: '100%',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    // marginBottom: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  image: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  machineText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#777',
  },
  line: {
    width: '100%',
    backgroundColor: '#eee',
    height: 1,
    marginVertical: 10,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 5,
    marginTop: 5
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
  },
  footer: {
    // marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  temperatureText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#888',
  },
});

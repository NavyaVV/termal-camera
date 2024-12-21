import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Add from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import MachineCard from './components/MachineCard';
import MachineActionSheet from './components/AddMachine';
import axiosInstance from '../../api/AxiosConfig';

const MachineHome = () => {
  const navigation = useNavigation();
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const actionSheetRef = useRef(null);

  const fetchData = async (page = 1, append = false) => {
    try {
      const response = await axiosInstance.get(`thermal-image/machine-list/`, {
        params: {page},
      });
      const newData = response?.data?.data || [];
      const newPagination = response?.data?.pagination;
      console.log(response?.data, 'machines');

      setImageList(prevList => (append ? [...prevList, ...newData] : newData));
      setPagination(newPagination);
      setLoading(false);
      setRefreshing(false);
      setIsFetchingMore(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      setRefreshing(false);
      setIsFetchingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination?.has_next_page && !isFetchingMore) {
      const nextPage = pagination?.next_page_number;
      setIsFetchingMore(true);
      fetchData(nextPage, true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(1);
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.imageItem}>
        <MachineCard
          machine={item?.machine}
          location={item?.location}
          description={item?.description}
          onPress={() =>
            navigation.navigate('HomeScreen', {
              id: item?.id,
              machine: item?.machine,
            })
          }
        />
      </View>
    );
  };

  const handleModalSubmit = data => {
    console.log('Submitted Data:', data);
    setImageList(prevList => [data, ...prevList]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#000"
      />
      <View style={styles.container}>
        <Text style={styles.welcomeText}>TIM</Text>
        {loading ? (
          <ActivityIndicator color={'#000'} />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={imageList}
            keyExtractor={(item, index) =>
              item?.id ? item.id.toString() : index.toString()
            } // Fallback to index if item.id is undefined
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingMore ? (
                <ActivityIndicator color="#000" size={'large'} />
              ) : null
            }
          />
        )}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => actionSheetRef.current?.show()}>
          <Add name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <MachineActionSheet ref={actionSheetRef} onSubmit={handleModalSubmit} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    margin: 20,
    textAlign: 'center',
  },
  imageItem: {
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    marginLeft: 10,
    marginRight: 10,
    // margin: 20
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: '#000',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
});

export default MachineHome;

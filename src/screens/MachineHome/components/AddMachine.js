import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import axiosInstance from '../../../api/AxiosConfig';
import Icon from 'react-native-vector-icons/AntDesign';

const MachineActionSheet = React.forwardRef(({onSubmit}, ref) => {
  const [machineName, setMachineName] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleSubmit = async () => {
    const data = {machine: machineName, location: location, details: details};
    try {
      const response = await axiosInstance.post(
        'thermal-image/create-machine/',
        data,
      );
      console.log('Machine created successfully:', response.data);
      onSubmit(data); 
      setMachineName('');
      setLocation('');
      setDetails('');
      setSuccessModalVisible(true); 
      if (ref && ref.current) ref.current.hide();

      setTimeout(() => {
        setSuccessModalVisible(false);
      }, 2000);
    } catch (error) {
      console.error('Error creating machine:', error?.response?.data || error);
      alert('Failed to create machine. Please try again.');
    }
  };

  return (
    <ActionSheet ref={ref} gestureEnabled={true}>
      <View style={styles.sheetContainer}>
        <Text style={styles.sheetTitle}>Add Machine</Text>
        <Text style={styles.titleText}>Machine Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Machine Name"
          value={machineName}
          placeholderTextColor={'#000'}
          onChangeText={setMachineName}
        />
        <Text style={styles.titleText}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          placeholderTextColor={'#000'}
          onChangeText={setLocation}
        />
        <Text style={styles.titleText}>Details</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Details"
          value={details}
                    placeholderTextColor={'#000'}
          onChangeText={setDetails}
          multiline
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              if (ref && ref.current) ref.current.hide();
            }}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}>
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            <Icon name="checkcircle" size={48} color="#000" />
            <Text style={styles.successModalText}>Submission Successful!</Text>
          </View>
        </View>
      </Modal>
    </ActionSheet>
  );
});

const styles = StyleSheet.create({
  sheetContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  multilineInput: {
    height: 85,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 10,
  },
  successModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successModalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  successModalButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  successModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MachineActionSheet;

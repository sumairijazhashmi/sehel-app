import React, { useState } from 'react';
import { Modal, View, TextInput, Button, StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LocationModal = ({ visible, onClose, onSave }) => {
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const handleSave = () => {
    onSave({ area, city, country });
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Area"
            value={area}
            onChangeText={(text) => setArea(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={(text) => setCity(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Country"
            value={country}
            onChangeText={(text) => setCountry(text)}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Save"
              onPress={handleSave}
            />
            <Button
              title="Cancel"
              onPress={onClose}
              color="gray"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: windowWidth - 40, // Adjust width as per your design
    maxHeight: windowHeight * 0.6, // Maximum height of the modal
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default LocationModal;

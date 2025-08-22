import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Image as ImageIcon, Video, Plus, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import CalendarPicker from 'react-native-calendar-picker';
import { useStore, Furniture } from '@/store';
import { router } from 'expo-router';

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [size, setSize] = useState('');
  const [rooms, setRooms] = useState('');
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [smokingAllowed, setSmokingAllowed] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [hasBalcony, setHasBalcony] = useState(false);
  const [cost, setCost] = useState('');
  const [arnona, setArnona] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [floor, setFloor] = useState('');
  const [hasElevator, setHasElevator] = useState(false);
  const [bombShelter, setBombShelter] = useState<'apartment' | 'building' | '100meters' | 'none'>('none');
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [newFurnitureItem, setNewFurnitureItem] = useState('');
  const [newFurnitureQuantity, setNewFurnitureQuantity] = useState('1');
  const [rentalType, setRentalType] = useState<'room' | 'apartment' | 'sublet'>('apartment');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [openHouseDate, setOpenHouseDate] = useState(new Date());
  const [openHouseTime, setOpenHouseTime] = useState(new Date());
  const [entryDate, setEntryDate] = useState(new Date());
  const [showOpenHouseDatePicker, setShowOpenHouseDatePicker] = useState(false);
  const [showOpenHouseTimePicker, setShowOpenHouseTimePicker] = useState(false);
  const [showEntryDatePicker, setShowEntryDatePicker] = useState(false);

  const { addPost } = useStore();

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map(asset => asset.uri)]);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
    }
  };

  const addFurnitureItem = () => {
    if (newFurnitureItem.trim() && parseInt(newFurnitureQuantity) > 0) {
      setFurniture([
        ...furniture,
        { item: newFurnitureItem.trim(), quantity: parseInt(newFurnitureQuantity) },
      ]);
      setNewFurnitureItem('');
      setNewFurnitureQuantity('1');
    }
  };

  const removeFurnitureItem = (index: number) => {
    setFurniture(furniture.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!images.length || !size || !rooms || !cost || !city || !street || !neighborhood || !phoneNumber) return;

    addPost({
      id: Date.now().toString(),
      images,
      video: video || undefined,
      size: parseFloat(size),
      rooms: parseFloat(rooms),
      petsAllowed,
      smokingAllowed,
      hasParking,
      hasBalcony,
      cost: parseFloat(cost),
      arnona: parseFloat(arnona || '0'),
      address: {
        city,
        street,
        neighborhood,
        floor: parseInt(floor || '0'),
      },
      hasElevator,
      bombShelter,
      furniture,
      rentalType,
      phoneNumber,
      entryDate: entryDate.toISOString(),
      openHouse: {
        date: openHouseDate.toISOString().split('T')[0],
        time: openHouseTime.toLocaleTimeString(),
        registeredUsers: [],
      },
      username: 'John Doe',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      createdAt: new Date().toISOString(),
      likes: [],
    });

    router.push('/');
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>List Apartment</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Media</Text>
          <View style={styles.mediaButtons}>
            <TouchableOpacity style={styles.mediaButton} onPress={pickImages}>
              <ImageIcon size={32} color="#0891b2" />
              <Text style={styles.mediaButtonText}>Add Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaButton} onPress={pickVideo}>
              <Video size={32} color="#0891b2" />
              <Text style={styles.mediaButtonText}>Add Video</Text>
            </TouchableOpacity>
          </View>
          {images.length > 0 && (
            <ScrollView horizontal style={styles.imagePreviewScroll}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imagePreviewContainer}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setImages(images.filter((_, i) => i !== index))}>
                    <X size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Size (square meters)"
            value={size}
            onChangeText={setSize}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Number of Rooms"
            value={rooms}
            onChangeText={setRooms}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Monthly Rent (₪)"
            value={cost}
            onChangeText={setCost}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Arnona (₪)"
            value={arnona}
            onChangeText={setArnona}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowEntryDatePicker(true)}>
            <Text style={styles.datePickerButtonText}>
              Entry Date: {entryDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.togglesContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, petsAllowed && styles.toggleButtonActive]}
              onPress={() => setPetsAllowed(!petsAllowed)}>
              <Text style={[styles.toggleText, petsAllowed && styles.toggleTextActive]}>
                Pets Allowed
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, smokingAllowed && styles.toggleButtonActive]}
              onPress={() => setSmokingAllowed(!smokingAllowed)}>
              <Text style={[styles.toggleText, smokingAllowed && styles.toggleTextActive]}>
                Smoking Allowed
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, hasParking && styles.toggleButtonActive]}
              onPress={() => setHasParking(!hasParking)}>
              <Text style={[styles.toggleText, hasParking && styles.toggleTextActive]}>
                Parking
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, hasBalcony && styles.toggleButtonActive]}
              onPress={() => setHasBalcony(!hasBalcony)}>
              <Text style={[styles.toggleText, hasBalcony && styles.toggleTextActive]}>
                Balcony
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, hasElevator && styles.toggleButtonActive]}
              onPress={() => setHasElevator(!hasElevator)}>
              <Text style={[styles.toggleText, hasElevator && styles.toggleTextActive]}>
                Elevator
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={styles.input}
            placeholder="Street"
            value={street}
            onChangeText={setStreet}
          />
          <TextInput
            style={styles.input}
            placeholder="Neighborhood"
            value={neighborhood}
            onChangeText={setNeighborhood}
          />
          <TextInput
            style={styles.input}
            placeholder="Floor"
            value={floor}
            onChangeText={setFloor}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bomb Shelter</Text>
          <View style={styles.radioGroup}>
            {(['apartment', 'building', '100meters', 'none'] as const).map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.radioButton, bombShelter === option && styles.radioButtonActive]}
                onPress={() => setBombShelter(option)}>
                <Text style={[styles.radioText, bombShelter === option && styles.radioTextActive]}>
                  {option === 'apartment'
                    ? 'In Apartment'
                    : option === 'building'
                    ? 'In Building'
                    : option === '100meters'
                    ? 'Within 100m'
                    : 'None'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Furniture</Text>
          <View style={styles.furnitureInput}>
            <TextInput
              style={[styles.input, styles.furnitureItemInput]}
              placeholder="Item name"
              value={newFurnitureItem}
              onChangeText={setNewFurnitureItem}
            />
            <TextInput
              style={[styles.input, styles.furnitureQuantityInput]}
              placeholder="Qty"
              value={newFurnitureQuantity}
              onChangeText={setNewFurnitureQuantity}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.addFurnitureButton} onPress={addFurnitureItem}>
              <Plus size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {furniture.map((item, index) => (
            <View key={index} style={styles.furnitureItem}>
              <Text style={styles.furnitureItemText}>
                {item.quantity}x {item.item}
              </Text>
              <TouchableOpacity
                style={styles.removeFurnitureButton}
                onPress={() => removeFurnitureItem(index)}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rental Type</Text>
          <View style={styles.radioGroup}>
            {(['room', 'apartment', 'sublet'] as const).map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.radioButton, rentalType === option && styles.radioButtonActive]}
                onPress={() => setRentalType(option)}>
                <Text style={[styles.radioText, rentalType === option && styles.radioTextActive]}>
                  {option === 'room'
                    ? 'Room'
                    : option === 'apartment'
                    ? 'Whole Apartment'
                    : 'Sublet'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Open House</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowOpenHouseDatePicker(true)}>
            <Text style={styles.datePickerButtonText}>
              Date: {openHouseDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowOpenHouseTimePicker(true)}>
            <Text style={styles.datePickerButtonText}>
              Time: {openHouseTime.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!images.length || !size || !rooms || !cost || !city || !street || !neighborhood || !phoneNumber) &&
              styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!images.length || !size || !rooms || !cost || !city || !street || !neighborhood || !phoneNumber}>
          <Text style={styles.submitButtonText}>List Apartment</Text>
        </TouchableOpacity>
      </View>

      {/* Entry Date Picker Modal */}
      <Modal
        visible={showEntryDatePicker}
        transparent={true}
        animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <Text style={styles.calendarTitle}>Select Entry Date</Text>
            <CalendarPicker
              onDateChange={(date) => {
                setEntryDate(date as Date);
                setShowEntryDatePicker(false);
              }}
              selectedStartDate={entryDate}
              minDate={new Date()}
              initialDate={entryDate}
              selectedDayColor="#0891b2"
              selectedDayTextColor="#fff"
              todayBackgroundColor="#e0f2fe"
              todayTextStyle={{ color: '#0891b2' }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowEntryDatePicker(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Open House Date Picker Modal */}
      <Modal
        visible={showOpenHouseDatePicker}
        transparent={true}
        animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <Text style={styles.calendarTitle}>Select Open House Date</Text>
            <CalendarPicker
              onDateChange={(date) => {
                setOpenHouseDate(date as Date);
                setShowOpenHouseDatePicker(false);
              }}
              selectedStartDate={openHouseDate}
              minDate={new Date()}
              initialDate={openHouseDate}
              selectedDayColor="#0891b2"
              selectedDayTextColor="#fff"
              todayBackgroundColor="#e0f2fe"
              todayTextStyle={{ color: '#0891b2' }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowOpenHouseDatePicker(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      {showOpenHouseTimePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={openHouseTime}
          mode="time"
          is24Hour={true}
          onChange={(event, selectedTime) => {
            setShowOpenHouseTimePicker(false);
            if (selectedTime) {
              setOpenHouseTime(selectedTime);
            }
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  mediaButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mediaButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
  },
  mediaButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: '#0891b2',
    fontWeight: '500',
  },
  imagePreviewScroll: {
    flexDirection: 'row',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginRight: 8,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  togglesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    margin: 4,
  },
  toggleButtonActive: {
    backgroundColor: '#0891b2',
  },
  toggleText: {
    color: '#64748b',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#fff',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  radioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    margin: 4,
  },
  radioButtonActive: {
    backgroundColor: '#0891b2',
  },
  radioText: {
    color: '#64748b',
    fontWeight: '500',
  },
  radioTextActive: {
    color: '#fff',
  },
  furnitureInput: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  furnitureItemInput: {
    flex: 3,
    marginRight: 8,
    marginBottom: 0,
  },
  furnitureQuantityInput: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  addFurnitureButton: {
    backgroundColor: '#0891b2',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  furnitureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  furnitureItemText: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
  },
  removeFurnitureButton: {
    padding: 4,
  },
  datePickerButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#334155',
  },
  submitButton: {
    backgroundColor: '#0891b2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
});
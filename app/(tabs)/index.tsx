import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Filter, Heart, MessageCircle, Share2, X } from 'lucide-react-native';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/auth';
import CalendarPicker from 'react-native-calendar-picker';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [showFilters, setShowFilters] = useState(false);
  const { posts = [], activeFilters = {}, setFilters, clearFilters, toggleLike } = useStore();
  const { user } = useAuthStore();
  
  const [filterValues, setFilterValues] = useState({
    petsAllowed: activeFilters.petsAllowed || false,
    smokingAllowed: activeFilters.smokingAllowed || false,
    hasParking: activeFilters.hasParking || false,
    hasBalcony: activeFilters.hasBalcony || false,
    hasElevator: activeFilters.hasElevator || false,
    rentalType: activeFilters.rentalType,
    priceRange: activeFilters.priceRange || { min: 0, max: 10000 },
    roomsRange: activeFilters.roomsRange || { min: 0, max: 10 },
    bombShelter: activeFilters.bombShelter,
    city: activeFilters.city || '',
    neighborhood: activeFilters.neighborhood || '',
    entryDateFrom: activeFilters.entryDateFrom || new Date(),
    entryDateTo: activeFilters.entryDateTo || new Date(new Date().setMonth(new Date().getMonth() + 3)),
    showEntryDateFromPicker: false,
    showEntryDateToPicker: false,
  });

  const filteredPosts = (posts || []).filter((post) => {
    if (!post) return false;
    if (filterValues.petsAllowed && !post.petsAllowed) return false;
    if (filterValues.smokingAllowed && !post.smokingAllowed) return false;
    if (filterValues.hasParking && !post.hasParking) return false;
    if (filterValues.hasBalcony && !post.hasBalcony) return false;
    if (filterValues.hasElevator && !post.hasElevator) return false;
    if (filterValues.rentalType && post.rentalType !== filterValues.rentalType) return false;
    if (filterValues.bombShelter && post.bombShelter !== filterValues.bombShelter) return false;
    if (filterValues.city && !post.address?.city?.toLowerCase().includes(filterValues.city.toLowerCase())) return false;
    if (filterValues.neighborhood && !post.address?.neighborhood?.toLowerCase().includes(filterValues.neighborhood.toLowerCase())) return false;
    
    const cost = parseFloat(post.cost?.toString() || '0');
    if (!isNaN(cost)) {
      if (cost < filterValues.priceRange.min || cost > filterValues.priceRange.max) return false;
    }
    
    const rooms = parseFloat(post.rooms?.toString() || '0');
    if (!isNaN(rooms)) {
      if (rooms < filterValues.roomsRange.min || rooms > filterValues.roomsRange.max) return false;
    }
    
    if (filterValues.entryDateFrom && filterValues.entryDateTo && post.entryDate) {
      const entryDate = new Date(post.entryDate);
      const from = new Date(filterValues.entryDateFrom);
      const to = new Date(filterValues.entryDateTo);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      if (entryDate < from || entryDate > to) return false;
    }
    
    return true;
  });

  const handleApplyFilters = () => {
    setFilters(filterValues);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      petsAllowed: false,
      smokingAllowed: false,
      hasParking: false,
      hasBalcony: false,
      hasElevator: false,
      rentalType: undefined,
      bombShelter: undefined,
      priceRange: { min: 0, max: 10000 },
      roomsRange: { min: 0, max: 10 },
      city: '',
      neighborhood: '',
      entryDateFrom: new Date(),
      entryDateTo: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      showEntryDateFromPicker: false,
      showEntryDateToPicker: false,
    };
    
    setFilterValues(defaultFilters);
    clearFilters();
  };

  const renderPost = ({ item }) => {
    if (!item) return null;
    
    // Ensure likes is always an array
    const likes = Array.isArray(item.likes) ? item.likes : [];
    const isLiked = user?.id ? likes.includes(user.id) : false;
    
    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Image
            source={{ uri: item.userAvatar }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item.username}</Text>
        </View>
        
        <FlatList
          horizontal
          data={item.images || []}
          renderItem={({ item: imageUri }) => (
            <Image source={{ uri: imageUri }} style={styles.postImage} />
          )}
          keyExtractor={(imageUri, index) => `${imageUri}-${index}`}
          showsHorizontalScrollIndicator={false}
        />

        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleLike(item.id, user?.id || '')}>
            <Heart 
              size={24} 
              color={isLiked ? '#ef4444' : '#64748b'}
              fill={isLiked ? '#ef4444' : 'none'}
            />
            <Text style={styles.actionCount}>{likes.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={24} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View style={styles.postDetails}>
          <Text style={styles.price}>₪{(item.cost || 0).toLocaleString()}/month</Text>
          <Text style={styles.location}>
            {item.address?.neighborhood || ''}, {item.address?.city || ''}
          </Text>
          <Text style={styles.specs}>
            {item.rooms || 0} rooms • {item.size || 0}m² • Floor {item.address?.floor || 0}
          </Text>
          <Text style={styles.entryDate}>
            Available from: {new Date(item.entryDate || Date.now()).toLocaleDateString()}
          </Text>
          <View style={styles.features}>
            {item.petsAllowed && <Text style={styles.feature}>🐾 Pets allowed</Text>}
            {item.hasParking && <Text style={styles.feature}>🚗 Parking</Text>}
            {item.hasBalcony && <Text style={styles.feature}>🌅 Balcony</Text>}
            {item.hasElevator && <Text style={styles.feature}>🛗 Elevator</Text>}
            {item.bombShelter && item.bombShelter !== 'none' && (
              <Text style={styles.feature}>
                🛡️ Shelter: {
                  item.bombShelter === 'apartment' ? 'In Unit' :
                  item.bombShelter === 'building' ? 'In Building' :
                  'Within 100m'
                }
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Apartments</Text>
        <TouchableOpacity 
          style={[styles.filterButton, Object.keys(activeFilters || {}).length > 0 && styles.filterButtonActive]}
          onPress={() => setShowFilters(true)}>
          <Filter size={24} color={Object.keys(activeFilters || {}).length > 0 ? '#fff' : '#0891b2'} />
          {Object.keys(activeFilters || {}).length > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{Object.keys(activeFilters || {}).length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item?.id || Math.random().toString()}
        contentContainerStyle={styles.content}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No apartments found</Text>
            <Text style={styles.emptyStateText}>Try adjusting your filters</Text>
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={handleClearFilters}>
              <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity 
                onPress={() => setShowFilters(false)}
                style={styles.closeButton}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Location</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="City"
                  value={filterValues.city}
                  onChangeText={(text) => setFilterValues(v => ({ ...v, city: text }))}
                />
                <TextInput
                  style={styles.filterInput}
                  placeholder="Neighborhood"
                  value={filterValues.neighborhood}
                  onChangeText={(text) => setFilterValues(v => ({ ...v, neighborhood: text }))}
                />
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price Range</Text>
                <View style={styles.rangeInputs}>
                  <TextInput
                    style={[styles.filterInput, { flex: 1, marginRight: 8 }]}
                    placeholder="Min"
                    value={filterValues.priceRange.min.toString()}
                    onChangeText={(text) => setFilterValues(v => ({
                      ...v,
                      priceRange: { ...v.priceRange, min: parseInt(text) || 0 }
                    }))}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.filterInput, { flex: 1 }]}
                    placeholder="Max"
                    value={filterValues.priceRange.max.toString()}
                    onChangeText={(text) => setFilterValues(v => ({
                      ...v,
                      priceRange: { ...v.priceRange, max: parseInt(text) || 0 }
                    }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Rooms</Text>
                <View style={styles.rangeInputs}>
                  <TextInput
                    style={[styles.filterInput, { flex: 1, marginRight: 8 }]}
                    placeholder="Min"
                    value={filterValues.roomsRange.min.toString()}
                    onChangeText={(text) => setFilterValues(v => ({
                      ...v,
                      roomsRange: { ...v.roomsRange, min: parseInt(text) || 0 }
                    }))}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.filterInput, { flex: 1 }]}
                    placeholder="Max"
                    value={filterValues.roomsRange.max.toString()}
                    onChangeText={(text) => setFilterValues(v => ({
                      ...v,
                      roomsRange: { ...v.roomsRange, max: parseInt(text) || 0 }
                    }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Entry Date</Text>
                <TouchableOpacity
                  style={styles.filterInput}
                  onPress={() => setFilterValues(v => ({ ...v, showEntryDateFromPicker: true }))}>
                  <Text>From: {filterValues.entryDateFrom.toLocaleDateString()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.filterInput}
                  onPress={() => setFilterValues(v => ({ ...v, showEntryDateToPicker: true }))}>
                  <Text>To: {filterValues.entryDateTo.toLocaleDateString()}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Features</Text>
                <View style={styles.filterToggles}>
                  <TouchableOpacity
                    style={[styles.filterToggle, filterValues.petsAllowed && styles.filterToggleActive]}
                    onPress={() => setFilterValues(v => ({ ...v, petsAllowed: !v.petsAllowed }))}>
                    <Text style={[styles.filterToggleText, filterValues.petsAllowed && styles.filterToggleTextActive]}>
                      Pets Allowed
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterToggle, filterValues.smokingAllowed && styles.filterToggleActive]}
                    onPress={() => setFilterValues(v => ({ ...v, smokingAllowed: !v.smokingAllowed }))}>
                    <Text style={[styles.filterToggleText, filterValues.smokingAllowed && styles.filterToggleTextActive]}>
                      Smoking Allowed
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterToggle, filterValues.hasParking && styles.filterToggleActive]}
                    onPress={() => setFilterValues(v => ({ ...v, hasParking: !v.hasParking }))}>
                    <Text style={[styles.filterToggleText, filterValues.hasParking && styles.filterToggleTextActive]}>
                      Parking
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterToggle, filterValues.hasBalcony && styles.filterToggleActive]}
                    onPress={() => setFilterValues(v => ({ ...v, hasBalcony: !v.hasBalcony }))}>
                    <Text style={[styles.filterToggleText, filterValues.hasBalcony && styles.filterToggleTextActive]}>
                      Balcony
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterToggle, filterValues.hasElevator && styles.filterToggleActive]}
                    onPress={() => setFilterValues(v => ({ ...v, hasElevator: !v.hasElevator }))}>
                    <Text style={[styles.filterToggleText, filterValues.hasElevator && styles.filterToggleTextActive]}>
                      Elevator
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Rental Type</Text>
                <View style={styles.filterToggles}>
                  {(['room', 'apartment', 'sublet'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.filterToggle, filterValues.rentalType === type && styles.filterToggleActive]}
                      onPress={() => setFilterValues(v => ({ ...v, rentalType: v.rentalType === type ? undefined : type }))}>
                      <Text style={[styles.filterToggleText, filterValues.rentalType === type && styles.filterToggleTextActive]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Bomb Shelter</Text>
                <View style={styles.filterToggles}>
                  {(['apartment', 'building', '100meters', 'none'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.filterToggle, filterValues.bombShelter === type && styles.filterToggleActive]}
                      onPress={() => setFilterValues(v => ({ ...v, bombShelter: v.bombShelter === type ? undefined : type }))}>
                      <Text style={[styles.filterToggleText, filterValues.bombShelter === type && styles.filterToggleTextActive]}>
                        {type === 'apartment'
                          ? 'In Unit'
                          : type === 'building'
                          ? 'In Building'
                          : type === '100meters'
                          ? 'Within 100m'
                          : 'None'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.filterActions}>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={handleClearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={handleApplyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Entry Date From Picker Modal */}
      <Modal
        visible={filterValues.showEntryDateFromPicker}
        transparent={true}
        animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <Text style={styles.calendarTitle}>Select Start Date</Text>
            <CalendarPicker
              onDateChange={(date) => {
                setFilterValues(v => ({
                  ...v,
                  showEntryDateFromPicker: false,
                  entryDateFrom: date as Date
                }));
              }}
              selectedStartDate={filterValues.entryDateFrom}
              minDate={new Date()}
              initialDate={filterValues.entryDateFrom}
              selectedDayColor="#0891b2"
              selectedDayTextColor="#fff"
              todayBackgroundColor="#e0f2fe"
              todayTextStyle={{ color: '#0891b2' }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFilterValues(v => ({ ...v, showEntryDateFromPicker: false }))}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Entry Date To Picker Modal */}
      <Modal
        visible={filterValues.showEntryDateToPicker}
        transparent={true}
        animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <Text style={styles.calendarTitle}>Select End Date</Text>
            <CalendarPicker
              onDateChange={(date) => {
                setFilterValues(v => ({
                  ...v,
                  showEntryDateToPicker: false,
                  entryDateTo: date as Date
                }));
              }}
              selectedStartDate={filterValues.entryDateTo}
              minDate={filterValues.entryDateFrom}
              initialDate={filterValues.entryDateTo}
              selectedDayColor="#0891b2"
              selectedDayTextColor="#fff"
              todayBackgroundColor="#e0f2fe"
              todayTextStyle={{ color: '#0891b2' }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFilterValues(v => ({ ...v, showEntryDateToPicker: false }))}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: '#0891b2',
  },
  filterBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  postImage: {
    width: 300,
    height: 300,
    marginRight: 8,
  },
  postActions: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionCount: {
    marginLeft: 6,
    color: '#64748b',
    fontSize: 14,
  },
  postDetails: {
    padding: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 4,
  },
  specs: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  entryDate: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  feature: {
    fontSize: 14,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalScroll: {
    flex: 1,
    padding: 24,
  },
  closeButton: {
    padding: 4,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  filterInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  rangeInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterToggles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  filterToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    margin: 4,
  },
  filterToggleActive: {
    backgroundColor: '#0891b2',
  },
  filterToggleText: {
    color: '#64748b',
    fontWeight: '500',
  },
  filterToggleTextActive: {
    color: '#fff',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  clearButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#0891b2',
    marginLeft: 8,
    alignItems: 'center',
  },
  applyButtonText: {
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
  closeButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  clearFiltersButton: {
    backgroundColor: '#0891b2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearFiltersButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
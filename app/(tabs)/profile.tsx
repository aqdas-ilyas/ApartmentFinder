import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Bell, CreditCard as Edit2, Circle as XCircle, Trash2 } from 'lucide-react-native';
import { useStore } from '@/store';
import { router } from 'expo-router';

const notificationOptions = ['Every new post', 'Posts that match my filter', 'None'];

const closeReasons = [
  { id: 'app', label: 'Rented from the app' },
  { id: 'outside', label: 'Rented outside the app' },
  { id: 'regret', label: 'Regretted publishing' },
  { id: 'problems', label: 'Had problems with the app' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { posts = [], editPost, closePost, deletePost } = useStore();
  const [showPreferences, setShowPreferences] = useState(false);
  const [showListings, setShowListings] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');

  const handleEdit = (post) => {
    router.push({
      pathname: '/(tabs)/create',
      params: { editMode: true, postId: post.id }
    });
  };

  const handleClose = (post) => {
    setSelectedPost(post);
    setShowCloseModal(true);
  };

  const handleDelete = (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const confirmClose = (reason) => {
    closePost(selectedPost.id, reason);
    setShowCloseModal(false);
    setSelectedPost(null);
  };

  const confirmDelete = () => {
    if (deleteReason.trim()) {
      deletePost(selectedPost.id, deleteReason);
      setShowDeleteModal(false);
      setSelectedPost(null);
      setDeleteReason('');
    } else {
      Alert.alert('Required', 'Please provide a reason for deletion');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#0891b2" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileBio}>Photography enthusiast | Travel lover</Text>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1.2k</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>348</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.settingsSection} onPress={() => setShowPreferences(true)}>
          <Bell size={20} color="#0f172a" style={{ marginRight: 10 }} />
          <Text style={styles.settingsText}>Notification Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsSection} onPress={() => setShowListings(!showListings)}>
          <Bell size={20} color="#0f172a" style={{ marginRight: 10 }} />
          <Text style={styles.settingsText}>My Listings</Text>
        </TouchableOpacity>

        {showListings && (
          <View style={styles.listingsContainer}>
            {posts.map((post) => (
              <View key={post.id} style={styles.listingCard}>
                <View style={styles.listingHeader}>
                  <Text style={styles.listingTitle}>
                    {post.address.city}, {post.address.neighborhood}
                  </Text>
                  <Text style={styles.listingPrice}>₪{post.cost.toLocaleString()}/month</Text>
                </View>
                
                <View style={styles.listingDetails}>
                  <Text style={styles.listingSpecs}>
                    {post.rooms} rooms • {post.size}m² • Floor {post.address.floor}
                  </Text>
                  <Text style={styles.listingDate}>
                    Posted on: {new Date(post.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.listingActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEdit(post)}>
                    <Edit2 size={18} color="#0891b2" />
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.closeButton]}
                    onPress={() => handleClose(post)}>
                    <XCircle size={18} color="#f59e0b" />
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(post)}>
                    <Trash2 size={18} color="#ef4444" />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Close Listing Modal */}
      <Modal
        visible={showCloseModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCloseModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Why are you closing this listing?</Text>
            {closeReasons.map((reason) => (
              <TouchableOpacity
                key={reason.id}
                style={styles.reasonButton}
                onPress={() => confirmClose(reason.id)}>
                <Text style={styles.reasonText}>{reason.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCloseModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Listing Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDeleteModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Why do you want to delete this listing?</Text>
            <TextInput
              style={styles.deleteReasonInput}
              placeholder="Please provide a reason..."
              value={deleteReason}
              onChangeText={setDeleteReason}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={styles.confirmDeleteButton}
              onPress={confirmDelete}>
              <Text style={styles.confirmDeleteText}>Delete Listing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowDeleteModal(false);
                setDeleteReason('');
              }}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Notification Preferences Modal */}
      <Modal
        visible={showPreferences}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPreferences(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notification Preferences</Text>
            {notificationOptions.map((option, index) => (
              <TouchableOpacity key={index} style={styles.modalOption}>
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowPreferences(false)}>
              <Text style={styles.cancelButtonText}>Close</Text>
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
  settingsButton: {
    padding: 8,
  },
  content: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  settingsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingsText: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '500',
  },
  listingsContainer: {
    marginTop: 16,
  },
  listingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0891b2',
  },
  listingDetails: {
    marginBottom: 16,
  },
  listingSpecs: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  listingDate: {
    fontSize: 14,
    color: '#94a3b8',
  },
  listingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#e0f2fe',
  },
  closeButton: {
    backgroundColor: '#fef3c7',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  editButtonText: {
    marginLeft: 4,
    color: '#0891b2',
    fontWeight: '500',
  },
  closeButtonText: {
    marginLeft: 4,
    color: '#f59e0b',
    fontWeight: '500',
  },
  deleteButtonText: {
    marginLeft: 4,
    color: '#ef4444',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#334155',
  },
  reasonButton: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  reasonText: {
    fontSize: 16,
    color: '#334155',
  },
  deleteReasonInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
    fontSize: 16,
  },
  confirmDeleteButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmDeleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
});
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/auth';

export default function LikedScreen() {
  const insets = useSafeAreaInsets();
  const { posts = [] } = useStore();
  const { user } = useAuthStore();
  
  const likedPosts = posts.filter(post => 
    Array.isArray(post?.likes) && post.likes.includes(user?.id || '')
  );

  const renderPost = ({ item }) => (
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

      <View style={styles.postDetails}>
        <Text style={styles.price}>₪{(item.cost || 0).toLocaleString()}/month</Text>
        <Text style={styles.location}>
          {item.address?.neighborhood || ''}, {item.address?.city || ''}
        </Text>
        <Text style={styles.specs}>
          {item.rooms || 0} rooms • {item.size || 0}m² • Floor {item.address?.floor || 0}
        </Text>
        <Text style={styles.entryDate}>
          Available from: {item.entryDate ? new Date(item.entryDate).toLocaleDateString() : 'Not specified'}
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Liked Apartments</Text>
      </View>

      <FlatList
        data={likedPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Heart size={48} color="#94a3b8" />
            <Text style={styles.emptyStateText}>No liked apartments yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Like apartments from the home feed to see them here
            </Text>
          </View>
        )}
      />
    </View>
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});
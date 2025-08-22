import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '@/store';

export default function DataScreen() {
  const insets = useSafeAreaInsets();
  const { posts = [] } = useStore();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'closed'>('all');

  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    if (selectedStatus === 'all') return posts;
    return posts.filter(post => 
      selectedStatus === 'active' ? !post.status || post.status === 'active' : post.status === 'closed'
    );
  }, [posts, selectedStatus]);

  const cityStats = useMemo(() => {
    if (!Array.isArray(filteredPosts)) return [];
    
    const stats = filteredPosts.reduce((acc, post) => {
      if (!post?.address?.city) return acc;
      const city = post.address.city;
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .map(([city, count]) => ({ city, count }));
  }, [filteredPosts]);

  const totalListings = filteredPosts.length;
  const activeListings = Array.isArray(posts) ? posts.filter(post => !post.status || post.status === 'active').length : 0;
  const closedListings = Array.isArray(posts) ? posts.filter(post => post.status === 'closed').length : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Apartment Data</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsOverview}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalListings}</Text>
            <Text style={styles.statLabel}>Total Listings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeListings}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{closedListings}</Text>
            <Text style={styles.statLabel}>Closed</Text>
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Filter by Status</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[styles.filterButton, selectedStatus === 'all' && styles.filterButtonActive]}
              onPress={() => setSelectedStatus('all')}>
              <Text style={[styles.filterButtonText, selectedStatus === 'all' && styles.filterButtonTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedStatus === 'active' && styles.filterButtonActive]}
              onPress={() => setSelectedStatus('active')}>
              <Text style={[styles.filterButtonText, selectedStatus === 'active' && styles.filterButtonTextActive]}>
                Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedStatus === 'closed' && styles.filterButtonActive]}
              onPress={() => setSelectedStatus('closed')}>
              <Text style={[styles.filterButtonText, selectedStatus === 'closed' && styles.filterButtonTextActive]}>
                Closed
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.citySection}>
          <Text style={styles.sectionTitle}>Listings by City</Text>
          {cityStats.map(({ city, count }, index) => (
            <View key={city} style={styles.cityRow}>
              <Text style={styles.cityName}>{city}</Text>
              <View style={styles.cityBarContainer}>
                <View 
                  style={[
                    styles.cityBar, 
                    { width: `${(count / Math.max(...cityStats.map(s => s.count))) * 100}%` }
                  ]} 
                />
                <Text style={styles.cityCount}>{count}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0891b2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#0891b2',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  citySection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cityRow: {
    marginBottom: 16,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 8,
  },
  cityBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityBar: {
    height: 8,
    backgroundColor: '#0891b2',
    borderRadius: 4,
    marginRight: 8,
  },
  cityCount: {
    fontSize: 14,
    color: '#64748b',
    minWidth: 24,
  },
});
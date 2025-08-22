import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function PrivacyPolicyScreen() {
  const handleAccept = () => {
    router.replace('/(tabs)');
  };

  const handleDecline = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        
        <Text style={styles.section}>Last updated: February 2024</Text>

        <Text style={styles.heading}>1. Information We Collect</Text>
        <Text style={styles.text}>
          We collect information you provide directly to us, including:
          {'\n'}- Name and email address when you create an account
          {'\n'}- Profile information such as photos and preferences
          {'\n'}- Apartment listing details and images
          {'\n'}- Communication preferences
        </Text>

        <Text style={styles.heading}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          We use the information we collect to:
          {'\n'}- Provide and maintain our services
          {'\n'}- Process your apartment listings
          {'\n'}- Send you notifications about relevant apartments
          {'\n'}- Improve our services and develop new features
        </Text>

        <Text style={styles.heading}>3. Information Sharing</Text>
        <Text style={styles.text}>
          We do not sell your personal information. We may share your information:
          {'\n'}- With other users when you post a listing
          {'\n'}- With service providers who assist in our operations
          {'\n'}- When required by law or to protect rights
        </Text>

        <Text style={styles.heading}>4. Your Rights</Text>
        <Text style={styles.text}>
          You have the right to:
          {'\n'}- Access your personal information
          {'\n'}- Correct inaccurate information
          {'\n'}- Request deletion of your information
          {'\n'}- Opt out of marketing communications
        </Text>

        <Text style={styles.heading}>5. Data Security</Text>
        <Text style={styles.text}>
          We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction.
        </Text>

        <Text style={styles.heading}>6. Contact Us</Text>
        <Text style={styles.text}>
          If you have questions about this Privacy Policy, please contact us at:
          {'\n'}privacy@example.com
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={handleAccept}>
          <Text style={styles.acceptButtonText}>Accept & Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={handleDecline}>
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
  },
  section: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 24,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  acceptButton: {
    backgroundColor: '#0891b2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  declineButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  declineButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {user?.user_metadata?.fullName || 'Guest'}
        </Text>
        <Text style={styles.subtitle}>How can we help you today?</Text>
      </View>

      <View style={styles.quickActions}>
        <Link href="/symptoms" asChild>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="medical" size={24} color="#0ea5e9" />
            <Text style={styles.actionTitle}>Check Symptoms</Text>
            <Text style={styles.actionDescription}>
              Identify possible conditions based on your symptoms
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/appointments" asChild>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="calendar" size={24} color="#0ea5e9" />
            <Text style={styles.actionTitle}>Book Appointment</Text>
            <Text style={styles.actionDescription}>
              Schedule a visit with a doctor
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/chat" asChild>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="chatbubbles" size={24} color="#0ea5e9" />
            <Text style={styles.actionTitle}>Chat with Doctor</Text>
            <Text style={styles.actionDescription}>
              Get quick medical advice online
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/map" asChild>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="location" size={24} color="#0ea5e9" />
            <Text style={styles.actionTitle}>Find Nearby</Text>
            <Text style={styles.actionDescription}>
              Locate doctors in your area
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Tips</Text>
        <View style={styles.tipCard}>
          <Ionicons name="information-circle" size={24} color="#0ea5e9" />
          <Text style={styles.tipText}>
            Regular check-ups can help detect health issues early. Don't ignore
            mild symptoms - consult with our doctors today.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f0f9ff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  quickActions: {
    padding: 20,
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
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
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  tipCard: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#0f172a',
  },
});
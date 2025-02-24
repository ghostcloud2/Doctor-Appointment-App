import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to DocCare</Text>
        
        <View style={styles.quickActions}>
          <Link href="/symptoms" asChild>
            <TouchableOpacity style={[styles.actionCard, styles.blueCard]}>
              <Text style={styles.actionText}>Check Symptoms</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/appointments" asChild>
            <TouchableOpacity style={[styles.actionCard, styles.greenCard]}>
              <Text style={styles.actionText}>Book Appointment</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/chat" asChild>
            <TouchableOpacity style={[styles.actionCard, styles.purpleCard]}>
              <Text style={styles.actionText}>Chat with Doctor</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/profile" asChild>
            <TouchableOpacity style={[styles.actionCard, styles.grayCard]}>
              <Text style={styles.actionText}>My Profile</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              Regular check-ups can help detect health issues early. Don't ignore mild symptoms - consult with our doctors today.
            </Text>
          </View>
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
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0f172a',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  blueCard: {
    backgroundColor: '#0ea5e9',
  },
  greenCard: {
    backgroundColor: '#22c55e',
  },
  purpleCard: {
    backgroundColor: '#8b5cf6',
  },
  grayCard: {
    backgroundColor: '#64748b',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  tipsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#0f172a',
  },
  tipCard: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
  },
  tipText: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 20,
  },
});
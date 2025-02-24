import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

export default function Profile() {
  const { user, signOut } = useAuth();
  const { profile, loading, error, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phoneNumber: profile?.phone_number || '',
  });

  const handleUpdate = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  if (loading) {
    return <Text style={styles.message}>Loading profile...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>
          {profile?.full_name || 'Update your profile'}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        {isEditing ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={formData.fullName}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, fullName: text }))
                }
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, phoneNumber: text }))
                }
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditing(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdate}>
                <Text style={[styles.buttonText, styles.saveButtonText]}>
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setIsEditing(true)}>
              <Ionicons name="person" size={24} color="#0ea5e9" />
              <Text style={styles.menuText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={24} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="notifications" size={24} color="#0ea5e9" />
              <Text style={styles.menuText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={24} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="shield-checkmark" size={24} color="#0ea5e9" />
              <Text style={styles.menuText}>Privacy & Security</Text>
              <Ionicons name="chevron-forward" size={24} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="help-circle" size={24} color="#0ea5e9" />
              <Text style={styles.menuText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={24} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.signOutButton]}
              onPress={signOut}>
              <Ionicons name="log-out" size={24} color="#ef4444" />
              <Text style={[styles.menuText, styles.signOutText]}>Sign Out</Text>
            </TouchableOpacity>
          </>
        )}
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
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f0f9ff',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#64748b',
  },
  section: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: '#0f172a',
  },
  signOutButton: {
    marginTop: 16,
  },
  signOutText: {
    color: '#ef4444',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  saveButton: {
    backgroundColor: '#0ea5e9',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  saveButtonText: {
    color: '#fff',
  },
  message: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 16,
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 16,
  },
});
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const { signUp, error } = useAuth();

  const handleRegister = async () => {
    await signUp(email, password, { fullName, role });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join DocCare today</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === 'patient' && styles.roleButtonActive,
          ]}
          onPress={() => setRole('patient')}>
          <Text
            style={[
              styles.roleButtonText,
              role === 'patient' && styles.roleButtonTextActive,
            ]}>
            Patient
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === 'doctor' && styles.roleButtonActive,
          ]}
          onPress={() => setRole('doctor')}>
          <Text
            style={[
              styles.roleButtonText,
              role === 'doctor' && styles.roleButtonTextActive,
            ]}>
            Doctor
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Link href="/login" asChild>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  roleButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  roleButtonActive: {
    backgroundColor: '#0ea5e9',
  },
  roleButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#0ea5e9',
    fontSize: 16,
  },
  error: {
    color: '#ef4444',
    marginBottom: 16,
  },
});
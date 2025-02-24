import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Link } from 'expo-router';
import { useAppointments } from '@/hooks/useAppointments';

// Only import MapView when not on web
let MapView: any = null;
let Marker: any = null;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { doctors } = useAppointments();
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Maps are not available on web. Please use our mobile app for this feature.</Text>
        <View style={styles.doctorList}>
          <Text style={styles.sectionTitle}>Available Doctors</Text>
          {doctors.map((doctor) => (
            <View key={doctor.id} style={styles.doctorCard}>
              <Text style={styles.doctorName}>
                Dr. {doctor.profile.full_name}
              </Text>
              <Text style={styles.doctorSpecialty}>
                {doctor.specialization}
              </Text>
              <Text style={styles.doctorFee}>
                Consultation Fee: ${doctor.consultation_fee}
              </Text>
              <Link href="/appointments" asChild>
                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>Book Appointment</Text>
                </TouchableOpacity>
              </Link>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && MapView && (
        <>
          <MapView
            provider="google"
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
              pinColor="#0ea5e9"
            />
            {doctors.map((doctor) => (
              <Marker
                key={doctor.id}
                coordinate={{
                  latitude: doctor.latitude || location.coords.latitude + Math.random() * 0.01,
                  longitude: doctor.longitude || location.coords.longitude + Math.random() * 0.01,
                }}
                title={`Dr. ${doctor.profile.full_name}`}
                description={`${doctor.specialization} - $${doctor.consultation_fee}`}
                onPress={() => setSelectedDoctor(doctor)}
              />
            ))}
          </MapView>

          {selectedDoctor && (
            <View style={styles.doctorCard}>
              <Text style={styles.doctorName}>
                Dr. {selectedDoctor.profile.full_name}
              </Text>
              <Text style={styles.doctorSpecialty}>
                {selectedDoctor.specialization}
              </Text>
              <Text style={styles.doctorFee}>
                Consultation Fee: ${selectedDoctor.consultation_fee}
              </Text>
              <Link href="/appointments" asChild>
                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>Book Appointment</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 16,
  },
  message: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
  doctorList: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  doctorCard: {
    position: Platform.OS === 'web' ? 'relative' : 'absolute',
    bottom: Platform.OS === 'web' ? 0 : 20,
    left: Platform.OS === 'web' ? 0 : 20,
    right: Platform.OS === 'web' ? 0 : 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: Platform.OS === 'web' ? 16 : 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  doctorFee: {
    fontSize: 14,
    color: '#0ea5e9',
    marginBottom: 12,
  },
  bookButton: {
    backgroundColor: '#0ea5e9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
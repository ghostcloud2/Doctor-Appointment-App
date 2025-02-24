import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppointments } from '@/hooks/useAppointments';
import { format } from 'date-fns';

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { doctors, appointments, loading, error, bookAppointment } =
    useAppointments();

  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
  ];

  const nextWeekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const isSlotAvailable = (doctor: any, time: string) => {
    return !appointments.some(
      (apt) =>
        apt.doctor_id === doctor.id &&
        apt.appointment_date === format(selectedDate, 'yyyy-MM-dd') &&
        apt.appointment_time === time
    );
  };

  if (loading) {
    return <Text style={styles.message}>Loading doctors...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.dateList}>
            {nextWeekDates.map((date) => (
              <TouchableOpacity
                key={date.toISOString()}
                style={[
                  styles.dateButton,
                  selectedDate.toDateString() === date.toDateString() &&
                    styles.dateButtonSelected,
                ]}
                onPress={() => setSelectedDate(date)}>
                <Text style={styles.dateDay}>
                  {format(date, 'EEE')}
                </Text>
                <Text style={styles.dateNum}>
                  {format(date, 'd')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Doctors</Text>
        {doctors.map((doctor) => (
          <View key={doctor.id} style={styles.doctorCard}>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>
                Dr. {doctor.profile.full_name}
              </Text>
              <Text style={styles.doctorSpecialty}>
                {doctor.specialization}
              </Text>
              <Text style={styles.doctorFee}>
                Consultation Fee: ${doctor.consultation_fee}
              </Text>
            </View>

            <View style={styles.timeSlots}>
              <Text style={styles.timeSlotsTitle}>Available Times</Text>
              <View style={styles.timeGrid}>
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      !isSlotAvailable(doctor, time) && styles.timeSlotUnavailable,
                    ]}
                    disabled={!isSlotAvailable(doctor, time)}
                    onPress={() =>
                      bookAppointment(doctor.id, selectedDate, time)
                    }>
                    <Text
                      style={[
                        styles.timeText,
                        !isSlotAvailable(doctor, time) && styles.timeTextUnavailable,
                      ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  dateList: {
    flexDirection: 'row',
    gap: 8,
  },
  dateButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    minWidth: 60,
  },
  dateButtonSelected: {
    backgroundColor: '#0ea5e9',
  },
  dateDay: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  dateNum: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  doctorCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  doctorInfo: {
    marginBottom: 16,
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
    fontWeight: '500',
  },
  timeSlots: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
  },
  timeSlotsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 12,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 8,
    minWidth: '30%',
    alignItems: 'center',
  },
  timeSlotUnavailable: {
    backgroundColor: '#e2e8f0',
  },
  timeText: {
    color: '#0f172a',
    fontSize: 14,
  },
  timeTextUnavailable: {
    color: '#94a3b8',
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
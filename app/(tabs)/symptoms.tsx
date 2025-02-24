import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSymptoms } from '@/hooks/useSymptoms';

export default function Symptoms() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { symptoms, conditions, loading, error } = useSymptoms();

  const filteredSymptoms = symptoms.filter((symptom) =>
    symptom.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const matchedConditions = conditions.filter((condition) =>
    condition.symptoms.some((symptomId) => selectedSymptoms.includes(symptomId))
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search symptoms..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Your Symptoms</Text>
        {loading ? (
          <Text>Loading symptoms...</Text>
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <View style={styles.symptomsGrid}>
            {filteredSymptoms.map((symptom) => (
              <TouchableOpacity
                key={symptom.id}
                style={[
                  styles.symptomButton,
                  selectedSymptoms.includes(symptom.id) && styles.symptomSelected,
                ]}
                onPress={() => toggleSymptom(symptom.id)}>
                <Text
                  style={[
                    styles.symptomText,
                    selectedSymptoms.includes(symptom.id) &&
                      styles.symptomTextSelected,
                  ]}>
                  {symptom.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {selectedSymptoms.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Possible Conditions</Text>
          {matchedConditions.map((condition) => (
            <View key={condition.id} style={styles.conditionCard}>
              <Text style={styles.conditionName}>{condition.name}</Text>
              <Text style={styles.conditionDescription}>
                {condition.description}
              </Text>
              {condition.recommended_specialist && (
                <View style={styles.specialistContainer}>
                  <Ionicons name="medical" size={16} color="#0ea5e9" />
                  <Text style={styles.specialistText}>
                    Recommended specialist: {condition.recommended_specialist}
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f1f5f9',
    margin: 16,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
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
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomButton: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    minWidth: '48%',
  },
  symptomSelected: {
    backgroundColor: '#0ea5e9',
  },
  symptomText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
  symptomTextSelected: {
    color: '#fff',
  },
  conditionCard: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  conditionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  conditionDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  specialistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  specialistText: {
    marginLeft: 8,
    color: '#0ea5e9',
    fontSize: 14,
  },
  bookButton: {
    backgroundColor: '#0ea5e9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 16,
  },
});
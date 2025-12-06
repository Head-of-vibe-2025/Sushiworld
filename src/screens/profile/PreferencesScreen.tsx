// Preferences Screen

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/design-system';

export default function PreferencesScreen() {
  const { user } = useAuth();
  const [allergies, setAllergies] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');

  const handleSave = async () => {
    if (!user) return;

    // TODO: Save preferences to Supabase
    // await profileService.updatePreferences(user.id, {
    //   allergies: allergies.split(',').map(a => a.trim()),
    //   dietary_restrictions: dietaryRestrictions.split(',').map(d => d.trim()),
    // });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Allergies</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Shellfish, Peanuts"
          value={allergies}
          onChangeText={setAllergies}
          multiline
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Dietary Restrictions</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Vegetarian, Gluten-free"
          value={dietaryRestrictions}
          onChangeText={setDietaryRestrictions}
          multiline
        />
      </View>

      <Button
        title="Save Preferences"
        onPress={handleSave}
        variant="primary"
        fullWidth
        size="large"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});


// Redeem Points Screen

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { formatPoints, pointsToEuros } from '../../utils/formatting';
import { LOYALTY_CONFIG } from '../../utils/constants';

export default function RedeemPointsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Placeholder data - will be fetched from Supabase
  const availablePoints = 1250;
  const redemptionOptions = [
    { points: 500, euros: 5 },
    { points: 1000, euros: 10 },
    { points: 2000, euros: 20 },
  ];

  const handleRedeem = async (points: number, euros: number) => {
    if (availablePoints < points) {
      Alert.alert('Insufficient Points', `You need ${points} points to redeem €${euros}`);
      return;
    }

    setLoading(true);
    try {
      // TODO: Call Supabase Edge Function to create Foxy coupon
      // This will create a coupon in Foxy.io and deduct points
      Alert.alert(
        'Success!',
        `You've redeemed ${formatPoints(points)} points for a €${euros} discount coupon. Check your email!`
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not redeem points');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Redeem Points</Text>
        <Text style={styles.subtitle}>
          Available: {formatPoints(availablePoints)} ({pointsToEuros(availablePoints).toFixed(2)} €)
        </Text>
      </View>

      {redemptionOptions.map((option) => (
        <TouchableOpacity
          key={option.points}
          style={[
            styles.optionCard,
            availablePoints < option.points && styles.optionCardDisabled,
          ]}
          onPress={() => handleRedeem(option.points, option.euros)}
          disabled={availablePoints < option.points || loading}
        >
          <View style={styles.optionContent}>
            <Text style={styles.optionEuros}>€{option.euros}</Text>
            <Text style={styles.optionPoints}>{formatPoints(option.points)} points</Text>
          </View>
          {availablePoints >= option.points && (
            <Text style={styles.redeemText}>Redeem →</Text>
          )}
        </TouchableOpacity>
      ))}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  optionCardDisabled: {
    opacity: 0.5,
  },
  optionContent: {
    flex: 1,
  },
  optionEuros: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 5,
  },
  optionPoints: {
    fontSize: 16,
    color: '#666',
  },
  redeemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


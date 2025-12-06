// Loyalty Screen

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/design-system';
import { formatPoints, pointsToEuros } from '../../utils/formatting';
import { LOYALTY_CONFIG } from '../../utils/constants';
import QRCode from 'react-native-qrcode-svg';
import type { NavigationParamList } from '../../types/app.types';

type LoyaltyScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Loyalty'>;

export default function LoyaltyScreen() {
  const navigation = useNavigation<LoyaltyScreenNavigationProp>();
  const { user } = useAuth();

  // Placeholder data - will be fetched from Supabase
  const points = 1250;
  const pendingPoints = 450;
  const canRedeem = points >= LOYALTY_CONFIG.MIN_REDEMPTION_POINTS;

  // QR code data for in-store scanning
  const qrData = user?.email || 'guest@example.com';

  return (
    <View style={styles.container}>
      <View style={styles.pointsCard}>
        <Text style={styles.pointsLabel}>Your Points</Text>
        <Text style={styles.pointsValue}>{formatPoints(points)}</Text>
        <Text style={styles.pointsEuros}>≈ {pointsToEuros(points).toFixed(2)} €</Text>
      </View>

      {pendingPoints > 0 && (
        <View style={styles.pendingCard}>
          <Text style={styles.pendingText}>
            You have {formatPoints(pendingPoints)} pending points
          </Text>
          <Text style={styles.pendingSubtext}>
            Create an account to claim them!
          </Text>
        </View>
      )}

      <View style={styles.qrCard}>
        <Text style={styles.qrTitle}>In-Store QR Code</Text>
        <Text style={styles.qrSubtitle}>
          Show this at checkout to earn points
        </Text>
        <View style={styles.qrContainer}>
          <QRCode value={qrData} size={200} />
        </View>
      </View>

      <Button
        title={canRedeem ? 'Redeem Points' : `Need ${LOYALTY_CONFIG.MIN_REDEMPTION_POINTS - points} more points`}
        onPress={() => navigation.navigate('RedeemPoints')}
        variant="primary"
        disabled={!canRedeem}
        fullWidth
        size="large"
        style={styles.redeemButton}
      />

      <Button
        title="View Points History"
        onPress={() => navigation.navigate('PointsHistory')}
        variant="secondary"
        fullWidth
        style={styles.historyButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  pointsCard: {
    backgroundColor: '#FF6B6B',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 10,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  pointsEuros: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  pendingCard: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  pendingText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  pendingSubtext: {
    fontSize: 14,
    color: '#666',
  },
  qrCard: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  qrSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  redeemButton: {
    marginBottom: 15,
  },
  historyButton: {
    marginTop: 0,
  },
});


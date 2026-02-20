import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDeals, createDeal, updateDealStage } from '../services/api';

const stages = [
  { id: 'lead', name: 'Lead', color: '#3B82F6' },
  { id: 'qualified', name: 'Qualified', color: '#F59E0B' },
  { id: 'proposal', name: 'Proposal', color: '#A100FF' },
  { id: 'negotiation', name: 'Negotiation', color: '#10B981' },
  { id: 'closed_won', name: 'Closed Won', color: '#059669' },
  { id: 'closed_lost', name: 'Closed Lost', color: '#EF4444' },
];

const DealsScreen = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeal, setNewDeal] = useState({
    name: '',
    value: '',
    stage: 'lead',
  });
  const [saving, setSaving] = useState(false);

  const fetchDeals = async () => {
    try {
      const data = await getDeals();
      setDeals(data);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDeals();
    setRefreshing(false);
  }, []);

  const handleAddDeal = async () => {
    if (!newDeal.name) {
      Alert.alert('Error', 'Deal name is required');
      return;
    }

    setSaving(true);
    try {
      await createDeal({
        name: newDeal.name,
        value: parseFloat(newDeal.value) || 0,
        stage: newDeal.stage,
      });
      setShowAddModal(false);
      setNewDeal({ name: '', value: '', stage: 'lead' });
      fetchDeals();
      Alert.alert('Success', 'Deal created successfully');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to create deal');
    } finally {
      setSaving(false);
    }
  };

  const groupedDeals = stages.map((stage) => ({
    ...stage,
    deals: deals.filter((deal) => deal.stage === stage.id),
  }));

  const totalPipelineValue = deals
    .filter((d) => !['closed_won', 'closed_lost'].includes(d.stage))
    .reduce((sum, d) => sum + (d.value || 0), 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A100FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.headerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>€{totalPipelineValue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Pipeline Value</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{deals.length}</Text>
          <Text style={styles.statLabel}>Total Deals</Text>
        </View>
        <TouchableOpacity style={styles.addDealButton} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Pipeline View */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pipelineContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#A100FF']} />
        }
      >
        {groupedDeals.map((stage) => (
          <View key={stage.id} style={styles.stageColumn}>
            <View style={[styles.stageHeader, { backgroundColor: stage.color }]}>
              <Text style={styles.stageName}>{stage.name}</Text>
              <View style={styles.stageCount}>
                <Text style={styles.stageCountText}>{stage.deals.length}</Text>
              </View>
            </View>
            <ScrollView style={styles.stageDeals} showsVerticalScrollIndicator={false}>
              {stage.deals.map((deal) => (
                <View key={deal.deal_id} style={styles.dealCard}>
                  <Text style={styles.dealName} numberOfLines={2}>{deal.name}</Text>
                  <Text style={styles.dealValue}>€{(deal.value || 0).toLocaleString()}</Text>
                  {deal.probability && (
                    <View style={styles.probabilityContainer}>
                      <View style={styles.probabilityBar}>
                        <View
                          style={[
                            styles.probabilityFill,
                            { width: `${deal.probability}%`, backgroundColor: stage.color },
                          ]}
                        />
                      </View>
                      <Text style={styles.probabilityText}>{deal.probability}%</Text>
                    </View>
                  )}
                </View>
              ))}
              {stage.deals.length === 0 && (
                <View style={styles.emptyStage}>
                  <Text style={styles.emptyStageText}>No deals</Text>
                </View>
              )}
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      {/* Add Deal Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Deal</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Deal Name *</Text>
              <TextInput
                style={styles.input}
                value={newDeal.name}
                onChangeText={(text) => setNewDeal({ ...newDeal, name: text })}
                placeholder="Enterprise Contract"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Value (€)</Text>
              <TextInput
                style={styles.input}
                value={newDeal.value}
                onChangeText={(text) => setNewDeal({ ...newDeal, value: text })}
                placeholder="10000"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Stage</Text>
              <View style={styles.stageSelector}>
                {stages.slice(0, 4).map((stage) => (
                  <TouchableOpacity
                    key={stage.id}
                    style={[
                      styles.stageSelectorItem,
                      newDeal.stage === stage.id && { backgroundColor: stage.color },
                    ]}
                    onPress={() => setNewDeal({ ...newDeal, stage: stage.id })}
                  >
                    <Text
                      style={[
                        styles.stageSelectorText,
                        newDeal.stage === stage.id && { color: '#fff' },
                      ]}
                    >
                      {stage.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleAddDeal}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Create Deal</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerStats: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  addDealButton: {
    backgroundColor: '#A100FF',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pipelineContainer: {
    padding: 12,
  },
  stageColumn: {
    width: 280,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  stageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  stageCount: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stageCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  stageDeals: {
    padding: 8,
    maxHeight: 400,
  },
  dealCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  dealName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  dealValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A100FF',
    marginTop: 8,
  },
  probabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  probabilityBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginRight: 8,
  },
  probabilityFill: {
    height: '100%',
    borderRadius: 3,
  },
  probabilityText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  emptyStage: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStageText: {
    fontSize: 14,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  stageSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stageSelectorItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  stageSelectorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#A100FF',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DealsScreen;

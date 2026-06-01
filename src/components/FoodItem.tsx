import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FoodItemProps {
  record: {
    id: number;
    name: string;
    quantity: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingUnit: string;
    notes?: string;
  };
  onDelete: () => void;
}

export default function FoodItem({ record, onDelete }: FoodItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{record.name}</Text>
          <Text style={styles.quantity}>
            × {record.quantity} {record.servingUnit}
          </Text>
        </View>
        <TouchableOpacity onPress={onDelete} hitSlop={10}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.caloriesContainer}>
        <Text style={styles.calories}>
          {(record.calories * record.quantity).toFixed(0)}
        </Text>
        <Text style={styles.caloriesUnit}>kcal</Text>
      </View>

      <View style={styles.nutritionGrid}>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionLabel}>蛋白质</Text>
          <Text style={styles.nutritionValue}>
            {(record.protein * record.quantity).toFixed(1)}g
          </Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionLabel}>碳水</Text>
          <Text style={styles.nutritionValue}>
            {(record.carbs * record.quantity).toFixed(1)}g
          </Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionLabel}>脂肪</Text>
          <Text style={styles.nutritionValue}>
            {(record.fat * record.quantity).toFixed(1)}g
          </Text>
        </View>
      </View>

      {record.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notes}>{record.notes}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 12,
    color: '#999',
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  calories: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
    marginRight: 4,
  },
  caloriesUnit: {
    fontSize: 12,
    color: '#666',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  notes: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

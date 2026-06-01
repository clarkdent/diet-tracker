import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import { searchFoods, addFood, addDietRecord } from '../database/db';

export default function AddFoodScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [foodResults, setFoodResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const [showNewFoodForm, setShowNewFoodForm] = useState(false);
  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    category: 'other',
    servingSize: '100',
    servingUnit: 'g',
  });

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setFoodResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setLoading(true);
      const results = await searchFoods(query);
      setFoodResults(results || []);
      setShowSearchResults(true);
    } catch (error) {
      Alert.alert('错误', '搜索失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFood = (food: any) => {
    setSelectedFood(food);
    setShowSearchResults(false);
    setQuantity('1');
  };

  const handleAddRecord = async () => {
    if (!selectedFood || !quantity) {
      Alert.alert('提示', '请选择食物并输入数量');
      return;
    }

    try {
      const today = moment().format('YYYY-MM-DD');
      await addDietRecord(selectedFood.id, today, parseFloat(quantity), notes);
      
      Alert.alert('成功', '饮食记录已添加');
      
      setSelectedFood(null);
      setQuantity('1');
      setNotes('');
      setSearchQuery('');
    } catch (error) {
      Alert.alert('错误', '添加记录失败，请重试');
    }
  };

  const handleAddNewFood = async () => {
    if (!newFood.name || !newFood.calories) {
      Alert.alert('提示', '请填写食物名称和热量');
      return;
    }

    try {
      const foodId = await addFood(
        newFood.name,
        parseFloat(newFood.calories),
        parseFloat(newFood.protein) || 0,
        parseFloat(newFood.carbs) || 0,
        parseFloat(newFood.fat) || 0,
        parseFloat(newFood.fiber) || 0,
        newFood.category,
        parseFloat(newFood.servingSize),
        newFood.servingUnit
      );

      const today = moment().format('YYYY-MM-DD');
      await addDietRecord(foodId, today, parseFloat(quantity), notes);

      Alert.alert('成功', '新食物已添加并记录');

      setNewFood({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: '',
        category: 'other',
        servingSize: '100',
        servingUnit: 'g',
      });
      setShowNewFoodForm(false);
      setQuantity('1');
      setNotes('');
    } catch (error) {
      Alert.alert('错误', '添加食物失败，请重试');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>搜索食物</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="输入食物名称..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />

        {loading && <ActivityIndicator size="large" color="#007AFF" />}

        {showSearchResults && foodResults.length === 0 && searchQuery.length > 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>未找到匹配的食物</Text>
            <TouchableOpacity
              style={styles.addNewFoodBtn}
              onPress={() => {
                setShowNewFoodForm(true);
                setShowSearchResults(false);
              }}
            >
              <Text style={styles.addNewFoodBtnText}>+ 添加新食物</Text>
            </TouchableOpacity>
          </View>
        )}

        {showSearchResults && foodResults.map((food, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.foodOption,
              selectedFood?.id === food.id && styles.foodOptionSelected,
            ]}
            onPress={() => handleSelectFood(food)}
          >
            <View>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodInfo}>
                {food.calories} 卡路里 | {food.protein}g 蛋白质
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {selectedFood && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>饮食详情</Text>
          <View style={styles.selectedFoodCard}>
            <Text style={styles.selectedFoodName}>{selectedFood.name}</Text>
            
            <View style={styles.quantityContainer}>
              <Text style={styles.label}>数量 ({selectedFood.servingUnit})</Text>
              <TextInput
                style={styles.quantityInput}
                placeholder="1"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>热量</Text>
                <Text style={styles.nutritionValue}>
                  {(selectedFood.calories * parseFloat(quantity || 1)).toFixed(0)}
                </Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>蛋白质</Text>
                <Text style={styles.nutritionValue}>
                  {(selectedFood.protein * parseFloat(quantity || 1)).toFixed(1)}g
                </Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>碳水</Text>
                <Text style={styles.nutritionValue}>
                  {(selectedFood.carbs * parseFloat(quantity || 1)).toFixed(1)}g
                </Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>脂肪</Text>
                <Text style={styles.nutritionValue}>
                  {(selectedFood.fat * parseFloat(quantity || 1)).toFixed(1)}g
                </Text>
              </View>
            </View>

            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="备注（可选）"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleAddRecord}>
              <Text style={styles.saveBtnText}>保存记录</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showNewFoodForm && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>添加新食物</Text>
          
          <TextInput
            style={styles.input}
            placeholder="食物名称"
            value={newFood.name}
            onChangeText={(text) => setNewFood({ ...newFood, name: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="热量 (kcal/份)"
            value={newFood.calories}
            onChangeText={(text) => setNewFood({ ...newFood, calories: text })}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>营养信息 (每份)</Text>
          
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="蛋白质 (g)"
              value={newFood.protein}
              onChangeText={(text) => setNewFood({ ...newFood, protein: text })}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="碳水 (g)"
              value={newFood.carbs}
              onChangeText={(text) => setNewFood({ ...newFood, carbs: text })}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="脂肪 (g)"
              value={newFood.fat}
              onChangeText={(text) => setNewFood({ ...newFood, fat: text })}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="纤维 (g)"
              value={newFood.fiber}
              onChangeText={(text) => setNewFood({ ...newFood, fiber: text })}
              keyboardType="decimal-pad"
            />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleAddNewFood}>
            <Text style={styles.saveBtnText}>添加食物</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  foodOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  foodOptionSelected: {
    backgroundColor: '#f0f7ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  foodInfo: {
    fontSize: 12,
    color: '#999',
  },
  noResults: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  addNewFoodBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addNewFoodBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  selectedFoodCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  selectedFoodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  quantityContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  nutritionItem: {
    flex: 1,
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  halfInput: {
    flex: 1,
    marginBottom: 0,
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

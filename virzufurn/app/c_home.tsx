import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  background: '#FAF7F0',
  secondary: '#D8D2C2',
  accent: '#B17457',
  text: '#4A4947',
};

const Home = () => {
  const categories = [
    { name: 'Sofas', icon: 'weekend' },
    { name: 'Chairs', icon: 'event-seat' },
    { name: 'Dining', icon: 'restaurant' },
    { name: 'Storage', icon: 'storage' },
    { name: 'Lighting', icon: 'highlight' },
    { name: 'Lamps', icon: 'wb-incandescent' },
    { name: 'Decor', icon: 'spa' },
    { name: 'Mirrors', icon: 'filter-vintage' }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header Section */}
      <View style={styles.header}>
        <Icon name="settings" type="feather" size={24} color={COLORS.text} />
        <Text style={styles.appName}>Vizufurn</Text>
        <Icon name="shopping-bag" type="feather" size={24} color={COLORS.text} />
      </View>

      {/* Welcome Message */}
      <Text style={styles.welcomeText}>Discover your perfect space</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" type="feather" size={20} color={COLORS.text} />
        <TextInput
          placeholder="Search for furniture"
          placeholderTextColor={COLORS.text + '80'}
          style={styles.searchInput}
        />
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Browse Categories</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryItem}>
            <LinearGradient
              colors={[COLORS.secondary, COLORS.background]}
              style={styles.categoryIconContainer}
            >
              <Icon name={category.icon} type="material" size={28} color={COLORS.accent} />
            </LinearGradient>
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Arial',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 30,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 15,
  },
  categoriesContainer: {
    paddingBottom: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  featuredContainer: {
    marginTop: 10,
  },
  featuredItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  featuredItemText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
});

export default Home;
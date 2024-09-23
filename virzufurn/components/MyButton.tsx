import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
interface MyButtonProps{
    title:string;
    onPress: () => void;
}

const MyButton: React.FC<MyButtonProps> = ({ title,onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.6} 
    style={styles.button}
    onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4A4947",
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center', // Centers the text horizontally
    justifyContent: 'center', // Centers the text vertically
    marginVertical: 10, // Adds some vertical margin
    paddingTop:15,
  },
  buttonText: {
    color: "#FAF7F0", 
    fontSize: 16,
    fontWeight: "bold", 
  }
});

export default MyButton;

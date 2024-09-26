import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet, Pressable, Keyboard, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from "axios";

const COLORS = {
  background: '#FAF7F0',
  secondary: '#D8D2C2',
  accent: '#B17457',
  text: '#4A4947',
};

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const handleContinue = async () => {
    if (!emailOrUsername || !password) {
      setErrorMessage("Please enter both email and password");
      shakeAnimation();
      return;
    }
  
    try {
      setIsLoading(true);
      const response = await axios.post('http://192.168.1.71:8000/api/v1/users/login', {
        email: emailOrUsername,
        password: password
      });
  
      if (response.status === 200) {
        // Login successful, navigate to home or store tokens
        router.navigate("/c_home");
      } else {
        setErrorMessage("Invalid login credentials");
        shakeAnimation();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setErrorMessage(error.response.data.message || 'Invalid Email or password');
        } else if (error.request) {
          setErrorMessage('No response from server. Please check your internet connection.');
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      shakeAnimation();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    router.navigate("/signup");
  };

  const handleForgotPassword = () => {
    // Implement forgot password logic here
    console.log("Forgot password pressed");
    // You might want to navigate to a password reset screen or show a modal
    // For example: router.navigate("/reset-password");
  };

  const toggleSecureTextEntry = () => {
    setSecureTextEntry((prev) => !prev);
  };

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(animation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(animation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(animation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(animation, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  };

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.secondary]}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <Pressable style={styles.dismissKeyboard} onPress={Keyboard.dismiss}>
        <Animated.View style={[styles.formContainer, { transform: [{ translateX: animation }] }]}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={24} color={COLORS.accent} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email or Username"
              placeholderTextColor={COLORS.text + '80'}
              value={emailOrUsername}
              onChangeText={(text) => {
                setEmailOrUsername(text);
                if (errorMessage) setErrorMessage("");
              }}
              inputMode="email"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color={COLORS.accent} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.text + '80'}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage("");
              }}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
            />
            <Pressable onPress={toggleSecureTextEntry} style={styles.eyeIcon}>
              <Ionicons
                name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color={COLORS.accent}
              />
            </Pressable>
          </View>

          <Pressable onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <Pressable style={styles.loginButton} onPress={handleContinue}>
            <Text style={styles.loginButtonText}>{isLoading ? "Logging in..." : "Login"}</Text>
          </Pressable>

          <Pressable onPress={handleSignUp}>
            <Text style={styles.signUpText}>
              Don't have an account? <Text style={styles.signUpLink}>Sign up</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dismissKeyboard: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    fontWeight: "bold",
    color: COLORS.accent,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: COLORS.text,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: COLORS.accent,
    fontSize: 14,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 10,
  },
  loginButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 20,
    color: COLORS.text,
    fontSize: 14,
  },
  signUpLink: {
    color: COLORS.accent,
    fontWeight: "bold",
  },
});
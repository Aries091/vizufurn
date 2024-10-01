import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, Keyboard, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';

const COLORS = {
  background: '#FAF7F0',
  secondary: '#D8D2C2',
  accent: '#B17457',
  text: '#4A4947',
};

const Signup = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [animation] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignUp = async () => {
    if (!fullName || !username || !email || !password || !role) {
      setErrorMessage('Please enter all the fields');
      shakeAnimation();
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      shakeAnimation();
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://192.168.16.105:8000/api/v1/users/register', {
        fullName,
        username,
        email,
        password,
        role
      });

      if (response.status === 201) {
        // Successful registration
        router.navigate('/c_home');
      } else {
        // Handle unexpected status codes
        setErrorMessage('An unexpected error occurred. Please try again.');
        shakeAnimation();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setErrorMessage(error.response.data.message || 'Registration failed. Please try again.');
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

  const handleLogin = () => {
    router.navigate('/login');
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
      <TouchableOpacity style={styles.dismissKeyboard} onPress={Keyboard.dismiss} activeOpacity={1}>
        <Animated.View style={[styles.formContainer, { transform: [{ translateX: animation }] }]}>
          <Text style={styles.title}>Create Account</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={24} color={COLORS.accent} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Fullname"
              placeholderTextColor={COLORS.text + '80'}
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errorMessage) setErrorMessage('');
              }}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="at-outline" size={24} color={COLORS.accent} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={COLORS.text + '80'}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errorMessage) setErrorMessage('');
              }}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={24} color={COLORS.accent} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.text + '80'}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMessage) setErrorMessage('');
              }}
              keyboardType="email-address"
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
                if (errorMessage) setErrorMessage('');
              }}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={toggleSecureTextEntry} style={styles.eyeIcon}>
              <Ionicons
                name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color={COLORS.accent}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Select Role:</Text>
            <View style={styles.roleButtonContainer}>
              <TouchableOpacity
                style={[styles.roleButton, role === 'customer' && styles.activeRoleButton]}
                onPress={() => setRole('customer')}
              >
                <Text style={[styles.roleButtonText, role === 'customer' && styles.activeRoleButtonText]}>Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, role === 'seller' && styles.activeRoleButton]}
                onPress={() => setRole('seller')}
              >
                <Text style={[styles.roleButtonText, role === 'seller' && styles.activeRoleButtonText]}>Seller</Text>
              </TouchableOpacity>
            </View>
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TouchableOpacity 
            style={[styles.signupButton, isLoading && styles.disabledButton]} 
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.background} />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 24,
    fontWeight: 'bold',
    color: COLORS.accent,
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
  roleContainer: {
    width: '100%',
    marginBottom: 20,
  },
  roleLabel: {
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 10,
  },
  roleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginHorizontal: 5,
  },
  activeRoleButton: {
    backgroundColor: COLORS.accent,
  },
  roleButtonText: {
    color: COLORS.accent,
    textAlign: 'center',
    fontSize: 16,
  },
  activeRoleButtonText: {
    color: COLORS.background,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 16,
    textAlign: 'center',
  },
  signupButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 20,
    color: COLORS.text,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
});

export default Signup;
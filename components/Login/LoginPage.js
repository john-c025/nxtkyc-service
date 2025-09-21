'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../components/backend/axiosInstance';
import { API_ENDPOINTS } from '../../components/backend/apiHelper';
import Cookies from 'js-cookie';
import { 
  LoginContainer,
  LoginCard,
  LogoSection,
  FormSection,
  InputGroup,
  Input,
  Button,
  ErrorMessage,
  LoadingSpinner
} from './LoginPageStyled';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
          username,
          password,
        });

      console.log('Login successful:', response.data);
      Cookies.set('authToken', response.data.token, { expires: 7 });
          router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.status === 401) {
        setError('Invalid username or password');
      } else if (error.response?.status === 404) {
        setError('User not found');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LogoSection>
          <div className="logo">
            <h1>NXT KYC</h1>
            <p>Know Your Customer System</p>
      </div>
        </LogoSection>

        <FormSection>
          <form onSubmit={handleLogin}>
            <h2>Sign In</h2>
            <p>Enter your credentials to access the system</p>

            <InputGroup>
              <Input
                type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                required
              />
            </InputGroup>

            <InputGroup>
              <Input
                type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Button type="submit" disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Sign In'}
            </Button>
          </form>
        </FormSection>
      </LoginCard>
    </LoginContainer>
  );
}
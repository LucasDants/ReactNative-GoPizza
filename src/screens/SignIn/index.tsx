import { Button } from '@components/Button';
import { Input } from '@components/Input';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import brandImg from '@assets/brand.png'

import {
  Brand,
  Container, Content, ForgotPasswordButton, ForgotPasswordLabel, Title
} from './styles';
import { useAuth } from '@hooks/auth';

export function SignIn(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn, forgotPassword, isLogging} = useAuth()

  function handleSignIn() {
    signIn(email, password)
  }

  function handleForgotPassword() {
    forgotPassword(email)
  }

  return (
    <Container>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Content>
            <Brand source={brandImg} />
            <Title>Login</Title>
            <Input 
                placeholder='E-mail'
                type='secondary'
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={setEmail}
            />
            <Input 
                placeholder='Senha'
                type='secondary'
                secureTextEntry
                onChangeText={setPassword}
            />
            <ForgotPasswordButton onPress={handleForgotPassword}>
              <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
            </ForgotPasswordButton>

            <Button 
              title="Entrar"
              type='secondary'
              onPress={handleSignIn}
              isLoading={isLogging}
            />
          </Content>
      </KeyboardAvoidingView>
    </Container>
  );
}
import React, { useCallback, useRef } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.png';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { colors } from '../../globalVariables';

import { Container, Title, GoBack, GoBackText } from './styles';

interface SignUpFromData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { navigate, goBack } = useNavigation();
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(
    async (data: SignUpFromData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(
            6,
            'Digite uma senha com no mínimo 6 caracteres',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);
        Alert.alert(
          'Cadastrado com sucesso!',
          'Você já pode realizar o seu logon no GoBarber!',
          [{ text: 'ok', style: 'default' }],
        );

        formRef.current?.reset();
        navigate('SignIn');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(err);
          formRef.current?.setErrors(validationErrors);
          const errorMessages = Object.values(validationErrors);

          Alert.alert(
            'Erro ao cadastrar!',
            `Ocorreu um erro ao realizar o cadastro, por favor tente novamente! Verifique os campos a seguir: ${errorMessages.join(
              '; ',
            )}`,
            [{ text: 'ok', style: 'default' }],
          );
          return;
        }

        Alert.alert(
          'Erro ao cadastrar!',
          'Ocorreu um erro ao realizar o cadastro, por favor tente novamente ou verifique sua conexão com a internet!',
        );
      }
    },
    [navigate],
  );

  const handledGoBack = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Crie sua conta</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                name="name"
                placeholder="Nome"
                icon="user"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                placeholder="Email"
                icon="mail"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                placeholder="Senha"
                icon="lock"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
              <Button onPress={() => formRef.current?.submitForm()}>
                Cadastrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <GoBack onPress={handledGoBack}>
        <Icon name="arrow-left" size={20} color={colors.light2} />
        <GoBackText>Voltar para logon</GoBackText>
      </GoBack>
    </>
  );
};

export default SignUp;

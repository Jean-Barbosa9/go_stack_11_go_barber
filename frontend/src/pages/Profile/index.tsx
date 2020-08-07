import React, { useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiCamera } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'

import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';

import { colors } from '../../styles/variables';
import { Container, Content, AvatarInput } from './styles';

interface ProfileFromData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { user } = useAuth();

  const handleSubmit = useCallback( async (data: ProfileFromData) => {

    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        email: Yup.string().required('E-mail é obrigatório'),
        password: Yup.string().min(6, 'Mínimo 6 caracteres'),
      })

      await schema.validate(data, {
        abortEarly: false,
      });

      formRef.current?.reset();

      addToast({
        type: 'success',
        title: 'Perfil alterado com sucesso!',
      });

    } catch(err) {
      console.error(err)
      if(err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }

      addToast({
        type: 'error',
        title: 'Erro ao atualizar perfil!',
        description: 'Ocorreu um erro ao tentar atualizar o perfil, por favor tente novamente!'
      });
    }
  }, [addToast]);

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard" className="back">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{name: user.name, email: user.email}}
          onSubmit={handleSubmit}>
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <button type="button">
              <FiCamera size={24} color={colors.darkGrey} />
            </button>
          </AvatarInput>
          <h1>Meu perfil</h1>
          <Input
            name="name"
            type="text"
            placeholder="Nome"
            icon={FiUser}
          />
          <Input
            name="email"
            type="email"
            placeholder="E-mail"
            icon={FiMail}
          />
          <Input
            name="old_password"
            type="password"
            placeholder="Senha atual"
            icon={FiLock}
          />
          <Input
            name="password"
            type="password"
            placeholder="Nova senha"
            icon={FiLock}
          />
          <Input
            name="password_confirmation"
            type="password"
            placeholder="Confirmar no senha"
            icon={FiLock}
          />
          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;

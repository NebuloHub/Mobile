import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import LanguageToggleButton from '../../components/LanguageToggleButton';
import { t } from '../../i18n';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }: any) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);

  const handleLogin = async () => {
    try {
      await signIn({ email, senha });
    } catch (err) {
      console.log('Erro no login:', err);
      alert(t('logs.errorInvalidcredentials'));
    }
  };

  return (
    <SafeAreaView>
      <View>
        <LanguageToggleButton />
      </View>

      <View>
        <Text>{t('home.title')}</Text>
      </View>

      <View>
        {/* Email */}
        <View>
          <Text>Email</Text>
          <TextInput
            placeholder="Digite aqui seu email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        {/* Senha */}
        <View>
          <Text>Senha</Text>
          <View>
            <TextInput
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!showSenha}
            />

            <TouchableOpacity onPress={() => setShowSenha(!showSenha)}>
              <Ionicons
                name={showSenha ? 'eye-off' : 'eye'}
                size={22}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View> 
        <TouchableOpacity onPress={handleLogin}>
          <Text>Entrar</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text>Criar nova conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

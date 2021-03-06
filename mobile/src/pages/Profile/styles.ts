import styled from 'styled-components/native';
import { Platform } from 'react-native';

import { colors, fontFamilies } from '../../globalVariables';

export const Container = styled.View`
  flex: 1;
  margin-bottom: ${Platform.OS === 'android' ? 150 : 40}px;
  padding: 20px;
  justify-content: center;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 40px;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.Text`
  margin: 24px 0;
  font-family: ${fontFamilies.robotoMedium};
  font-size: 20px;
  color: ${colors.light2};
`;

export const SignOutButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const SignOutButtonText = styled.Text`
  margin-left: 10px;
  font-size: 18px;
  color: ${colors.light2};
`;

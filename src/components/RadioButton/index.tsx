import React from 'react';
import { TouchableOpacityProps, View } from 'react-native'

import {
  Container, Radio, RadioButtonProps, Selected, Title
} from './styles';

type Props = TouchableOpacityProps & RadioButtonProps & {
    title: string;
}

export function RadioButton({ selected = false, title, ...rest }: Props){
  return (
    <Container selected={selected} {...rest}>
        <Radio>{selected && <Selected />}</Radio>
        <Title>{title}</Title>
    </Container>
  );
}
import React from 'react';

import {
  Container, Description, Details, Identification, Image, Name, Content, Line
} from './styles';

import { Feather } from '@expo/vector-icons'
import { useTheme } from 'styled-components/native';
import { RectButtonProps } from 'react-native-gesture-handler';

export type ProductProps = {
    id: string;
    photo_url: string
    name: string;
    description: string;
}

type Props = RectButtonProps & {
    data: ProductProps
}

export function ProductCard({ data, ...rest}: Props){
    const { COLORS } = useTheme()

  return (
    <Container>
        <Content {...rest}>
            <Image source={{uri: data.photo_url }} />
            <Details>
                <Identification>
                    <Name>{data.name}</Name>
                    <Feather name="chevron-right" size={18} color={COLORS.TITLE} />
                </Identification>
                <Description>{data.description}</Description>
            </Details>
        </Content>
        <Line />
    </Container>
  );
}
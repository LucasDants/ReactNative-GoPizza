import { Button } from '@components/Button';
import { ButtonBack } from '@components/ButtonBack';
import { Input } from '@components/Input';
import { RadioButton } from '@components/RadioButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PIZZA_TYPES } from '@utils/pizzaTypes';
import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native'

import firestore from '@react-native-firebase/firestore'

import { OrderNavigationProps } from '../../@types/navigation'

import {
  Container,
  Form,
  FormRow,
  Header,
  Label,
  Photo,
  Sizes,
  Title,
  InputGroup,
  Price,
  ContentScroll
} from './styles';
import { ProductProps } from '@components/ProductCard';
import { useAuth } from '@hooks/auth';

type PizzaResponse = ProductProps & {
    prices_sizes: {
        [key: string]: number;
    }
}

export function Order(){
    const [size, setSize] = useState('')
    const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse)
    const [quantity, setQuantity] = useState(1)
    const [tableNumber, setTableNumber] = useState('')
    const [sendingOrder, setSendingOrder] = useState(false)

    const { user } = useAuth()
    
    const navigation = useNavigation()

    const amount = size ? pizza.prices_sizes[size] * quantity : '00,00' 

    const route = useRoute()
    const { id } = route.params as OrderNavigationProps

    function handleOrder() {
        if(!size) {
            return Alert.alert('Pedido', 'Selecione o tamanho da pizza.')
        }

        if(!tableNumber) {
            return Alert.alert('Pedido', 'Informe o número da mesa.')
        }

        if(!quantity) {
            return Alert.alert('Pedido', 'Informe a quantidade')
        }

        setSendingOrder(true)

        firestore()
        .collection('orders')
        .add({
            quantity,
            amount,
            pizza: pizza.name,
            size,
            table_number: tableNumber,
            status: 'Preparando',
            waiter_id: user?.id,
            image: pizza.photo_url
        })
        .then(() => navigation.navigate('home'))
        .catch(() => {
            setSendingOrder(false)
            Alert.alert('Pedido', 'Não foi possível realizar o pedido')
        })
    }

    useEffect(() => {
        if(id) {
            firestore()
            .collection('pizzas')
            .doc(id)
            .get()
            .then(response => setPizza(response.data() as PizzaResponse))
            .catch(() => Alert.alert('Pedido', "Não foi possível carregar o produto"))
        }

    }, [id])

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ContentScroll>

            <Header>
                <ButtonBack onPress={navigation.goBack} style={{ marginBottom: 108}} />
            </Header>
            <Photo source={{ uri : pizza.photo_url }} />

            <Form>
                <Title>{pizza.name}</Title>
                <Label>Selecione um tamanho</Label>
                <Sizes>
                    {
                        PIZZA_TYPES.map(item => (
                            <RadioButton key={item.id} title={item.name} selected={size === item.id} onPress={() => setSize(item.id)} />
                        ))
                    }
                </Sizes>

                <FormRow>
                    <InputGroup>
                        <Label>Número da mesa</Label>
                        <Input keyboardType="numeric" onChangeText={setTableNumber} value={tableNumber} />
                    </InputGroup>

                    <InputGroup>
                        <Label>Quantidade</Label>
                        <Input keyboardType="numeric" onChangeText={value => setQuantity(Number(value))} value={quantity.toString()} />
                    </InputGroup>
                </FormRow>
                <Price>Valor de R$ {amount}</Price>
                <Button title="Confirmar Pedido" onPress={handleOrder} isLoading={sendingOrder} />
            </Form>
        </ContentScroll>
    </Container>
  );
}
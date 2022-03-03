import React, { useCallback, useEffect, useState } from 'react';
import happyEmoji from '@assets/happy.png'
import { MaterialIcons } from '@expo/vector-icons'

import {
  Container,
  Greeting,
  GreetingEmoji,
  GreetingText,
  Header,
  MenuHeader,
  MenuItemsNumber,
  NewProductButton,
  Title,
} from './styles';
import { useTheme } from 'styled-components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Search } from '@components/Search';
import { ProductCard, ProductProps } from '@components/ProductCard';

import firestore from '@react-native-firebase/firestore'
import { Alert, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@hooks/auth';

export function Home(){
    const theme = useTheme()
    const navigation = useNavigation()
    const { user, signOut } = useAuth()

    const [pizzas, setPizzas] = useState<ProductProps[]>([])
    const [search, setSearch] = useState('')

    function fetchPizzas(value: string) {
        const formattedValue = value.toLowerCase().trim()

        firestore()
        .collection('pizzas')
        .orderBy('name_insensitive')
        .startAt(formattedValue)
        .endAt(`${formattedValue}\uf8ff`) // uf8ff saber que é o limite da consulta
        .get()
        .then(response => {
            const data = response.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            }) as ProductProps[]
           setPizzas(data)

        })
        .catch(() => Alert.alert('Consulta', 'Não foi possível realizar a consulta.'))
    }

    function handleSearch() {
        fetchPizzas(search)
    }

    function handleSearchClear() {
        setSearch('')
        fetchPizzas('')
    }

    function handleOpen(id: string) {
        const route = user?.isAdmin ? 'product' : 'order'
        navigation.navigate(route, { id })
    }

    function handleAdd() {
        navigation.navigate('product', {})
    }

    useFocusEffect(
        useCallback(() => {
            fetchPizzas('')
        }, [])
    )

  return (
    <Container>
        <Header>
            <Greeting>
                <GreetingEmoji source={happyEmoji} />
                <GreetingText>Olá, {user?.name}</GreetingText>
            </Greeting>
            <TouchableOpacity onPress={signOut}>
                <MaterialIcons name="logout" color={theme.COLORS.TITLE} size={24} />
            </TouchableOpacity>
        </Header>
        <Search onSearch={handleSearch} onClear={handleSearchClear} onChangeText={setSearch} value={search} />
        <MenuHeader>
            <Title>Cardápio</Title>
            <MenuItemsNumber>{pizzas.length} pizzas</MenuItemsNumber>
        </MenuHeader>

        <FlatList 
            data={pizzas}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <ProductCard 
                    data={item}
                    onPress={() => handleOpen(item.id)}
                />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingTop: 20,
                paddingBottom: 125,
                marginHorizontal: 24
            }}
        />
        {
            user?.isAdmin &&
            <NewProductButton title="Cadastrar pizza" type='secondary' onPress={handleAdd} />
        }
    </Container>
  );
}
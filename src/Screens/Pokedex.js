import React, { useEffect, useState } from 'react'
import { SafeAreaView} from 'react-native'
import { getPokemonDetailsByUrlApi, getPokemonsApi } from '../Api/Pokemon'
import PokemonList from '../Components/PokemonList'

export default function PokedexScreen() {
    const [pokemons,setPokemons] = useState([])

    const[nextUrl,setNextUrl] = useState(null)
    
    useEffect(()=>{
        (async()=>{
            await loadPokemons()
        })();
    },[])
    const loadPokemons = async()=>{
        try {
            const response = await getPokemonsApi(nextUrl)

            setNextUrl(response.next)
        
            const pokemonsArray = [];

            for await(const pokemon of response.results){
                const pokemonDetails = await getPokemonDetailsByUrlApi(pokemon.url)
                pokemonsArray.push({
                    id:pokemonDetails.id,
                    name: pokemonDetails.name,
                    type: pokemonDetails.types[0].type.name,
                    order: pokemonDetails.order,
                    img : pokemonDetails.sprites.other["official-artwork"].front_default

                })
            }

            setPokemons([...pokemons, ...pokemonsArray])
            
            
        } catch (error) {
           console.error(error)
        }
    }

    return (
        <SafeAreaView>
           <PokemonList pokemons = {pokemons} loadPokemons={loadPokemons} isNext={nextUrl} />
        </SafeAreaView>
    )
}

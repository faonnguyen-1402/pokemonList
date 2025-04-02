'use client';

import { useCallback, useEffect, useState } from 'react';

import Card from '@/core-components/Card';
import './page.css';
import FilterButton from '@/core-components/Filter-button';

const API_POKEMON = 'https://pokeapi.co/api/v2';
const SIZE_POKEMON_IMAGE = 96;
const ITEM_PER_PAGE = 48;

interface TypePokemon {
  name: string;
}

interface Pokemon {
  name: string;
  types: string[];
  imageUrl: string;
}

export default function Home() {
  const [countPokemon, setCountPokemon] = useState<number>(1200);
  const [types, setTypes] = useState<TypePokemon[]>([]);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [listPokemon, setListPokemon] = useState<Pokemon[]>([]);

  // use for pokemon filter
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);

  // use for pagination button
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(
    Math.ceil(countPokemon / ITEM_PER_PAGE)
  );

  const handlePaginationData = useCallback(async (currentPage: number) => {
    const offset = (currentPage - 1) * ITEM_PER_PAGE;
    try {
      const pokemonResponse = await fetch(
        `${API_POKEMON}/pokemon?limit=${ITEM_PER_PAGE}&offset=${offset}`
      );
      const pokemonData = await pokemonResponse.json();
      const urls = pokemonData.results.map((item: { url: string }) => item.url);

      const res = await Promise.all(
        urls.map(async (item) => {
          const data = await fetch(item);
          const pokemonItem = await data.json();
          return {
            name: pokemonItem.name,
            types: pokemonItem.types.map((typeInfo: any) => typeInfo.type.name),
            imageUrl:
              pokemonItem.sprites.other['official-artwork'].front_default ||
              '/images/placeholder.png',
          };
        })
      );

      setListPokemon(res);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleFilterPokemon = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  useEffect(() => {
    if (selectedTypes.length === 0) {
      setCountPokemon(allPokemon.length);
      setFilteredPokemon(allPokemon);
      setTotalPage(Math.ceil(allPokemon.length / ITEM_PER_PAGE));
      handlePaginationData(1);
      setPage(1);
      return;
    }

    const filtered = allPokemon.filter((pokemon) =>
      selectedTypes.every((selectedType) =>
        pokemon.types.includes(selectedType)
      )
    );

    setCountPokemon(filtered.length);
    setFilteredPokemon(filtered);
    setTotalPage(Math.ceil(filtered.length / ITEM_PER_PAGE));
    setListPokemon(filtered.slice(0, ITEM_PER_PAGE));
    setPage(1);
  }, [selectedTypes, allPokemon]);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const typeResponse = await fetch(`${API_POKEMON}/type`);
        const typeData = await typeResponse.json();
        setTypes(typeData.results);

        const pokemonResponse = await fetch(
          `${API_POKEMON}/pokemon?limit=1200`
        );
        const pokemonData = await pokemonResponse.json();
        const urls = pokemonData.results.map(
          (item: { url: string }) => item.url
        );

        const res = await Promise.all(
          urls.map(async (item) => {
            const data = await fetch(item);
            const pokemonItem = await data.json();
            return {
              name: pokemonItem.name,
              types: pokemonItem.types.map(
                (typeInfo: any) => typeInfo.type.name
              ),
              imageUrl:
                pokemonItem.sprites.other['official-artwork'].front_default ||
                '/images/placeholder.png',
            };
          })
        );

        setAllPokemon(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPokemonData();
    handlePaginationData(1);
  }, [handlePaginationData]);

  useEffect(() => {
    if (selectedTypes.length === 0) {
      handlePaginationData(page);
    } else {
      setListPokemon(
        filteredPokemon.slice((page - 1) * ITEM_PER_PAGE, page * ITEM_PER_PAGE)
      );
    }
  }, [page, filteredPokemon, selectedTypes, handlePaginationData]);

  return (
    <div className='container'>
      <div className='container-filterButton'>
        <h4 className='text'>Types: </h4>
        <div className='filter-button'>
          {types.map((item: TypePokemon) => (
            <FilterButton
              key={item.name}
              text={item.name}
              handleClick={() => handleFilterPokemon(item.name)}
            />
          ))}
        </div>
      </div>
      <div className='container-count-pokemon'>
        <p
          className='number-pokemon'
          style={{ display: countPokemon === 0 ? 'none' : 'block' }}
        >
          {countPokemon} results found.
        </p>
      </div>
      <div className='pokemon-frame'>
        {listPokemon.map((item, idx) => (
          <Card
            key={idx}
            title={item.name}
            urlImage={item.imageUrl}
            width={SIZE_POKEMON_IMAGE}
            height={SIZE_POKEMON_IMAGE}
          />
        ))}
      </div>
      {countPokemon === 0 && (
        <div>
          <p className='no-result'>No results found.</p>
        </div>
      )}
      <div className='justify-center'>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`button-pagination ${page > 1 ? 'is-active' : ''}`}
        >
          Prev
        </button>
        <button
          disabled={page >= totalPage}
          onClick={() => setPage(page + 1)}
          className={`button-pagination ${page < totalPage ? 'is-active' : ''}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

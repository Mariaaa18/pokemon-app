import { useState, useEffect } from "react";


export default function App() {

  const [pokemons, setPokemons] = useState([]);// confused  if it should be a state or not
  const [page, setPage] = useState(1);



  async function getPokemons(page) {

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${(page - 1) * 20}}`)
    const data = await res.json()
    const names = data.results.map(pokemon => pokemon.name)
    const promises = names.map(name => fetch(`https://pokeapi.co/api/v2/pokemon/${name}`))
    const results = await Promise.all(promises)
    const jsonResults = await Promise.all(results.map(result => result.json()))
    setPokemons(jsonResults)

  }

  useEffect(() => {
    getPokemons(page)
  }, [page])

  return (
    <div className="app-contaner">
      <h1>Pokemon Evolution</h1>
      <div className="pokemon-container">
        <PokemonList pokemons={pokemons} />
        <BeforeButton page={page} onPageChange={setPage} />
        <NextButton page={page} onPageChange={setPage} />
        <div>
          <Page page={page} />
        </div>
      </div>

    </div>
  );
}

function NextButton({ page, onPageChange }) {
  return (
    <button className="load-more" onClick={(e) => onPageChange(page + 1)}>
      Next
    </button>
  )
}

function BeforeButton({ page, onPageChange }) {
  return (
    <button className="load-more" onClick={(e) => onPageChange(page === 1 ? 1 : (page - 1))}>
      Before
    </button>

  )
}

function PokemonList({ pokemons }) {
  return (

    <ol className="all-container">
      {
        pokemons.map(pokemon =>
          <li key={pokemon.id}>
            <Pokemon
              id={pokemon.id}
              name={pokemon.name}
              image={pokemon.sprites.front_default}
              type={pokemon.types[0].type.name}
              secondaryType={pokemon.types[1]?.type.name}
            />
          </li>)
      }
    </ol>



  )

}

function Pokemon({ id, image, name, type, secondaryType }) {
  const [isShwon, setIsShown] = useState(false);
  const style = type + " thumb-conntainer";
  const handleClick = event => {
    setIsShown(!isShwon);
  }
  return (
    <div className={style}>
      <div className="number"><small>#0{id}</small></div>
      <img src={image} alt={name} />
      <div className="detail-wrapper">
        <h3>{name}</h3>

        {isShwon && (
          <div>
            Type= {secondaryType ? type+"/"+secondaryType : type}
          </div>
        )}
      </div>
      <button onClick={handleClick}>Details</button>


    </div>
  )
}

function Page({ page }) {
  return <label>{page}</label>
}



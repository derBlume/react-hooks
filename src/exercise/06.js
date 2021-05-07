// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

import {ErrorBoundary} from 'react-error-boundary'

/* class ErrorBoundary extends React.Component {
  state = {error: null}
  static getDerivedStateFromError(error) {
    return {error}
  }
  render() {
    const {error} = this.state
    if (error) {
      return <this.props.FallbackComponent error={error} />
    }
    return this.props.children
  }
} */

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [status, setStatus] = React.useState(pokemonName ? 'pending' : 'idle')

  React.useEffect(() => {
    if (pokemonName === '') {
      return
    }

    setStatus('pending')
    //setPokemon(null)
    //setError(null)

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setPokemon(pokemonData)
        setStatus('resolved')
      })

      .catch(error => {
        setError(error)
        setStatus('rejected')
      })
  }, [pokemonName])

  if (status === 'rejected') throw error
  else {
    return (
      <>
        {status === 'pending' && <PokemonInfoFallback name={pokemonName} />}
        {status === 'resolved' && <PokemonDataView pokemon={pokemon} />}
        {status === 'idle' && 'Submit a pokemon'}

        {/* {error ? (
        <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
        ) : pokemon ? (
          <PokemonDataView pokemon={pokemon} />
          ) : pokemonName ? (
            <PokemonInfoFallback name={pokemonName} />
            ) : (
              'Submit a pokemon'
            )} */}
      </>
    )
  }
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App

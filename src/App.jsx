import { useQuery, useQueryClient } from '@tanstack/react-query'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

const COUNTER_QUERY_KEY = ['counter']

const fetchInitialCounter = async () => {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return 0
}

function App() {
  const queryClient = useQueryClient()

  const { data: count = 0, isLoading } = useQuery({
    queryKey: COUNTER_QUERY_KEY,
    queryFn: fetchInitialCounter,
    staleTime: Infinity,
  })

  const changeCounter = (value) => {
    queryClient.setQueryData(COUNTER_QUERY_KEY, (current = 0) => Math.max(current + value, 0))
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>React Query no lugar de Redux</h1>
      <div className="card">
        {isLoading ? (
          <p>Carregando estado inicial...</p>
        ) : (
          <>
            <p>Estado global no cache do React Query:</p>
            <h2>count is {count}</h2>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={() => changeCounter(-1)}>-1</button>
              <button onClick={() => changeCounter(1)}>+1</button>
            </div>
          </>
        )}

        <p>
          O contador é gerenciado com <code>useQuery</code> + <code>queryClient.setQueryData</code>, sem Redux.
        </p>
      </div>
      <p className="read-the-docs">Clique nos logos para saber mais</p>
    </>
  )
}

export default App

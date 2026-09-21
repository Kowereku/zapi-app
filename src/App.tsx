import { QueryClientProvider } from '@tanstack/react-query'
import { CodeBackdrop } from '@/components/CodeBackdrop'
import { queryClient } from '@/lib/queryClient'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { StartPage } from '@/pages/StartPage'

const pages: Record<string, () => React.JSX.Element> = {
  '/login': LoginPage,
  '/register': RegisterPage,
}
const Page = pages[window.location.pathname] ?? StartPage

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CodeBackdrop />
      <Page />
    </QueryClientProvider>
  )
}

export default App

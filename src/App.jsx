import CalculadoraAuto from './components/CalculadoraAuto'
import Footer from './components/Footer'

function App() {
  return (
    <div className="w-full h-full flex flex-col min-h-screen bg-[#242424]">
      <div className="flex-grow">
        <CalculadoraAuto />
      </div>
      <Footer />
    </div>
  )
}

export default App

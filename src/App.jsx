import Simulation from './components/Simulation';

export default function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center',
        fontSize: '1.8rem',        
        margin: '12px 0 6px 0',   
        color: '#f1f5f9'
      }}>
        🧬 Эволюция существ
      </h1>
      <Simulation />
    </div>
  );
}


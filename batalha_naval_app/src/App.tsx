import React, { useState } from "react";
import axios from "axios";

interface Posicao {
  x: number;
  y: number;
}

const App: React.FC = () => {
  const [navios, setNavios] = useState([
    { nome: "", posicaoCentral: { x: 0, y: 0 }, orientacao: "horizontal" as "horizontal" | "vertical" },
    { nome: "", posicaoCentral: { x: 0, y: 0 }, orientacao: "horizontal" as "horizontal" | "vertical" }
  ]);
  const [correlationId, setCorrelationId] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [naviosRegistrados, setNaviosRegistrados] = useState(0);

  const registrarNavio = async (index: number) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/registrar", {
        nome: navios[index].nome,
        posicao_central: [navios[index].posicaoCentral.x, navios[index].posicaoCentral.y],
        orientacao: navios[index].orientacao,
        correlation_id: correlationId,
      });
      setMensagem(response.data.message);
      setNaviosRegistrados((prev) => prev + 1);
    } catch (error: any) {
      setMensagem(error.response?.data?.detail || "Erro ao registrar navio");
    }
  };

  const enviarAtaque = async (alvo: string, posicaoAtaque: Posicao) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/atacar", {
        atacante: navios[0].nome, // Supondo que o primeiro navio seja o atacante
        alvo,
        posicao_ataque: [posicaoAtaque.x, posicaoAtaque.y],
        correlation_id: correlationId,
      });
      setMensagem(response.data.message);
    } catch (error: any) {
      setMensagem(error.response?.data?.detail || "Erro no ataque");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Jogo de Batalha Naval</h1>
      {naviosRegistrados < 2 ? (
        <div>
          <h2>Registrar Navio {naviosRegistrados + 1}</h2>
          <input
            type="text"
            placeholder="Nome do navio"
            value={navios[naviosRegistrados].nome}
            onChange={(e) => {
              const newNavios = [...navios];
              newNavios[naviosRegistrados].nome = e.target.value;
              setNavios(newNavios);
            }}
          />
          <br />
          <input
            type="number"
            placeholder="Posição X"
            onChange={(e) => {
              const newNavios = [...navios];
              newNavios[naviosRegistrados].posicaoCentral.x = parseInt(e.target.value);
              setNavios(newNavios);
            }}
          />
          <input
            type="number"
            placeholder="Posição Y"
            onChange={(e) => {
              const newNavios = [...navios];
              newNavios[naviosRegistrados].posicaoCentral.y = parseInt(e.target.value);
              setNavios(newNavios);
            }}
          />
          <br />
          <select
            value={navios[naviosRegistrados].orientacao}
            onChange={(e) => {
              const newNavios = [...navios];
              newNavios[naviosRegistrados].orientacao = e.target.value as "horizontal" | "vertical";
              setNavios(newNavios);
            }}
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
          <br />
          <input
            type="text"
            placeholder="CorrelationId"
            value={correlationId}
            onChange={(e) => setCorrelationId(e.target.value)}
          />
          <br />
          <button onClick={() => registrarNavio(naviosRegistrados)}>Registrar Navio</button>
        </div>
      ) : (
        <div>
          <h2>Controle do Ataque</h2>
          <button onClick={() => enviarAtaque("NomeDoAlvo", { x: 10, y: 5 })}>
            Atacar posição (10, 5)
          </button>
        </div>
      )}
      <div style={{ marginTop: 20 }}>
        <strong>Status:</strong> {mensagem}
      </div>
      <hr />
      <div>
        <h2>Campo de Batalha</h2>
        {/* Aqui você pode renderizar uma grid 100x30. Por exemplo: */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(100, 20px)", gap: "1px" }}>
          {Array.from({ length: 3000 }, (_, idx) => (
            <div key={idx} style={{ width: 20, height: 20, background: "blue" }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

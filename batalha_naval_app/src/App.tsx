import React, { useState } from "react";
import axios from "axios";

interface Posicao {
  x: number;
  y: number;
}

const App: React.FC = () => {
  const [nome, setNome] = useState("");
  const [posicaoCentral, setPosicaoCentral] = useState<Posicao>({ x: 0, y: 0 });
  const [orientacao, setOrientacao] = useState<"horizontal" | "vertical">("horizontal");
  const [correlationId, setCorrelationId] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [registroRealizado, setRegistroRealizado] = useState(false);

  const registrarNavio = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/registrar", {
        nome,
        posicao_central: [posicaoCentral.x, posicaoCentral.y],
        orientacao,
        correlation_id: correlationId,
      });
      setMensagem(response.data.message);
      setRegistroRealizado(true);
      // Aqui você pode salvar a chave e as posições retornadas para uso futuro
    } catch (error: any) {
      setMensagem(error.response?.data?.detail || "Erro ao registrar navio");
    }
  };

  const enviarAtaque = async (alvo: string, posicaoAtaque: Posicao) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/atacar", {
        atacante: nome,
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
      {!registroRealizado ? (
        <div>
          <h2>Registrar Navio</h2>
          <input
            type="text"
            placeholder="Nome do navio (máx. 20 caracteres)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <br />
          <input
            type="number"
            placeholder="Posição X (central)"
            onChange={(e) =>
              setPosicaoCentral({ ...posicaoCentral, x: parseInt(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Posição Y (central)"
            onChange={(e) =>
              setPosicaoCentral({ ...posicaoCentral, y: parseInt(e.target.value) })
            }
          />
          <br />
          <select value={orientacao} onChange={(e) => setOrientacao(e.target.value as "horizontal" | "vertical")}>
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
          <button onClick={registrarNavio}>Registrar Navio</button>
        </div>
      ) : (
        <div>
          <h2>Controle do Ataque</h2>
          {/* Exemplo de ataque: você pode expandir para permitir selecionar posições na grid */}
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

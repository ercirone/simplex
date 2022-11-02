import React, { useState } from "react";
import Diagram from "./Diagram";
import Setup from "./Setup";
import { getClickableCoeffs, pivot } from "./simplex";

function App() {
  const [numVar, setNumVar] = useState(2);
  const [numIneq, setNumIneq] = useState(2);
  const [simplexSeq, setSimplexSeq] = useState(null);
  const [N, setN] = useState(0);
  return (
    <>
      <Setup
        initialNumVar={numVar}
        initialNumIneq={numIneq}
        setSimplexSeq={(seq) => {
          setSimplexSeq(seq);
          setN(N + 1);
        }}
        setNumVar={setNumVar}
        setNumIneq={setNumIneq}
        reset={() => setSimplexSeq(null)}
        alert={alert}
      ></Setup>
      {!simplexSeq
        ? null
        : simplexSeq.map((table, k) => (
          <React.Fragment key={`diagram-${N}-${k}`}>
            <div className="card mb-3"><div className="card-body">
              <h3 className="card-title mb-3 h5">
                {table["title"]}
              </h3>
              <Diagram
                numVar={numVar}
                numIneq={numIneq}
                rows={table["rows"]}
                labels={table["labels"]}
                clickableCoeffs={getClickableCoeffs(table["rows"])}
                onClick={(i, j) => () =>
                  setSimplexSeq([...simplexSeq, pivot(table, i, j)])}
              />
              {table["isFinal"] ? <p className="mt-3">Este diagrama es terminal porque no tiene indicadores positivos.</p> : null}
              {table["isUnbounded"] ? <p className="mt-3">Hay indicadores positivos pero
                es imposible seguir pivoteando debido a que todos los números en las columnas que están arriba de los indicadores positivos son negativos o cero.</p> : null}
            </div></div>
            {table["isFinal"] ?
              <div className="card mb-3"><div className="card-body">
                <h3 className="card-title mb-3 h5">Conclusión</h3>
                <p className="mt-3">
                  La función f alcanza un máximo de {table["f"].toFraction()} en el punto
                  ({table["x"].map(c => c.toFraction()).join(", ")}).
                </p>
              </div></div> :
              null}
              {table["isUnbounded"] ? 
              <div className="card mb-3"><div className="card-body">
              <h3 className="card-title mb-3 h5">Conclusión</h3>
              <p className="mt-3">
                El problema de programación lineal tiene una solución no acotada.
              </p>
            </div></div> :
              null}
          </React.Fragment>
        ))}
    </>
  );
}

export default App;

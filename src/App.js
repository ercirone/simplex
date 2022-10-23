import { useState } from "react";
import "./App.css";
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
      ></Setup>
      {!simplexSeq
        ? null
        : simplexSeq.map((table, k) => (
            <div key={`diagram-${N}-${k}`}>
              <Diagram
                numVar={numVar}
                numIneq={numIneq}
                rows={table["rows"]}
                labels={table["labels"]}
                clickableCoeffs={getClickableCoeffs(table["rows"])}
                onClick={(i, j) => () =>
                  setSimplexSeq([...simplexSeq, pivot(table, i, j)])}
              />
            </div>
          ))}
    </>
  );
}

export default App;

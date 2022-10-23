import Fraction from "fraction.js";
import React, { useState } from "react";
import { range } from "./utils";
import { getInitialTable, nameGen } from "./simplex";

const matrixId = (i, j) => `matrix-${i}-${j}`;
const indepId = (i) => `indep-${i}`;
const coeffId = (j) => `coeff-${j}`;

const Setup = ({
  setSimplexSeq,
  initialNumVar,
  initialNumIneq,
  setNumVar,
  setNumIneq,
}) => {
  const [nVar, setNVar] = useState(initialNumVar);
  const [nIneq, setNIneq] = useState(initialNumIneq);
  const [N, setN] = useState(0);
  const name = nameGen(nVar, nIneq, "x", "s");
  return (
    <>
      <p>
        <label>Número de variables:</label> &nbsp;
        <select
          value={nVar}
          onChange={(e) => {
            setNVar(+e.target.value);
            setN(N + 1);
          }}
        >
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </p>
      <p>
        <label>Número de restricciones:</label> &nbsp;
        <select
          value={nIneq}
          onChange={(e) => {
            setNIneq(+e.target.value);
            setN(N + 1);
          }}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </p>
      <div>
        <table>
          <tbody>
            {range(nIneq).map((i) => (
              <tr key={`row-${N}-${i}`}>
                {range(nVar).map((j) => (
                  <React.Fragment key={`${N}-${i}-${j}`}>
                    {j === 0 ? null : <td>+</td>}
                    <td>
                      <input type="text" id={matrixId(i, j)}></input>
                    </td>
                    <td>{name(j)}</td>
                  </React.Fragment>
                ))}
                <td>&le;</td>
                <td>
                  <input type="text" id={indepId(i)}></input>
                </td>
              </tr>
            ))}
            <tr>
              <td>f</td>
              <td>=</td>
              {range(nVar).map((j) => (
                <React.Fragment key={`coeff-${N}-${j}`}>
                  {j > 0 ? <td>+</td> : null}
                  <td>
                    <input type="text" id={coeffId(j)}></input>
                  </td>
                  <td>{name(j)}</td>
                </React.Fragment>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <button
          onClick={() => {
            const reading = readCoefficients(nVar, nIneq);
            if (reading) {
              const { matrix, indep, func } = reading;
              setSimplexSeq([getInitialTable(matrix, indep, func)]);
              setNumVar(nVar);
              setNumIneq(nIneq);
            }
          }}
        >
          ¡Empezar!
        </button>
      </p>
    </>
  );
};

const readCoefficients = (numVar, numIneq) => {
  let matrix, indep, func;
  try {
    matrix = range(numIneq).map((i) =>
      range(numVar).map((j) =>
        Fraction(document.getElementById(matrixId(i, j)).value)
      )
    );
    indep = range(numIneq).map((i) =>
      Fraction(document.getElementById(indepId(i)).value)
    );
    func = range(numVar).map((j) =>
      Fraction(document.getElementById(coeffId(j)).value)
    );
  } catch (e) {
    console.log("¡Error al leer los coeficienes!");
    return false;
  }
  return {
    matrix: matrix,
    indep: indep,
    func: func,
  };
};

export default Setup;

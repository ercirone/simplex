import Fraction from "fraction.js";
import React, { useRef, useState } from "react";
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
  reset,
}) => {
  const [nVar, setNVar] = useState(initialNumVar);
  const [nIneq, setNIneq] = useState(initialNumIneq);
  const [N, setN] = useState(0);
  const submitRef = useRef();
  const name = nameGen(nVar, nIneq, "x", "s");
  const handleSubmit = (e) => {
    e.preventDefault();
    const reading = readCoefficients(nVar, nIneq);
    reset();
    if (reading) {
      const { matrix, indep, func } = reading;
      setSimplexSeq([getInitialTable(matrix, indep, func)]);
      setNumVar(nVar);
      setNumIneq(nIneq);
      submitRef.current.focus();
    }
    return false;
  }
  const handleReset = (e) => {
    e.preventDefault();
    reset();
    for (let i = 0; i < nIneq; i++) {
      document.getElementById(indepId(i)).value = "";
      for (let j = 0; j < nVar; j++) {
        document.getElementById(matrixId(i, j)).value = "";
      }
    }
    for (let j = 0; j < nVar; j++) {
      document.getElementById(coeffId(j)).value = "";
    }
    window.scrollTo(0, 0);
    return false;
  }
  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <h3 className="card-title mb-3 h5">
            Nuevo problema estándar de maximización
          </h3>
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <div className="row mb-3">
              <label htmlFor="numVar" className="col-form-label col-auto">Número de variables:</label> &nbsp;
              <div className="col-auto">
                <select
                  id="numVar"
                  className="form-select"
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
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="numIneq" className="col-form-label col-auto">Número de restricciones:</label> &nbsp;
              <div className="col-auto">
                <select
                  id="numIneq"
                  className="form-select"
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
              </div>
            </div>
            <div>
              <p>Maximizar</p>
              <div className="input-group mb-3" style={{ "maxWidth": `${9 * nVar + 1}rem` }}>
                <span className="input-group-text p-1 cust">f</span>
                <span className="input-group-text p-1 cust">=</span>
                {range(nVar).map((j) => (
                  <React.Fragment key={`coeff-${N}-${j}`}>
                    {j > 0 ? <span className="input-group-text p-1 cust">+</span> : null}
                    <input type="text" className="form-control p-1" id={coeffId(j)}></input>
                    <span className="input-group-text p-1 cust">{name(j)}</span>
                  </React.Fragment>
                ))}
              </div>
              <p>sujeta a las restricciones:</p>
              {range(nIneq).map((i) => (
                <div className="input-group mb-3" style={{ "maxWidth": `${9 * nVar + 1}rem` }} key={`row-${N}-${i}`}>
                  {range(nVar).map((j) => (
                    <React.Fragment key={`${N}-${i}-${j}`}>
                      {j === 0 ? null : <span className="input-group-text p-1 cust">+</span>}
                      <input type="text" className="form-control p-1" id={matrixId(i, j)} />
                      <span className="input-group-text p-1 cust">{name(j)}</span>
                    </React.Fragment>
                  ))}
                  <span className="input-group-text p-1 cust">&le;</span>
                  <input type="text" className="form-control p-1" id={indepId(i)} />
                </div>
              ))}
              <p>{range(nVar).map(j =>
              <React.Fragment key={`ineq-${j}`}>{name(j)}&nbsp;&ge;&nbsp;0
              {j < nVar-2 ? <>,&nbsp;</> : j === nVar-2 ? <>&nbsp;y&nbsp;</> : <>.</>}
              </React.Fragment>
              )}</p>
            </div>
            <p>
              <input
                ref={submitRef}
                type="submit"
                className="btn btn-primary"
                value="¡Empezar!"
              />&nbsp;
              <input
                type="reset"
                className="btn btn-secondary"
                value="Limpiar"
              />
            </p>
          </form>
        </div>
      </div>
      <div id="liveAlertPlaceholder"></div>
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
    alert("¡Error al leer los coeficientes!", "danger");
    return false;
  }
  if (indep.some(c => c<=0)) {
    alert("¡Los términos independientes deben ser positivos!", "danger");
    return false;
  }
  return {
    matrix: matrix,
    indep: indep,
    func: func,
  };
};

const alert = (message, type) => {
  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')
  alertPlaceholder.append(wrapper)
}

export default Setup;

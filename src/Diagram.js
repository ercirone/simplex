import { useState } from "react";
import { range } from "./utils";
import { nameGen } from "./simplex";
import "./Diagram.css";

function Diagram({ numVar, numIneq, rows, labels, clickableCoeffs, onClick }) {
  const [clicked, setClicked] = useState(
    range(numIneq).map((i) => range(numVar + numIneq).map((j) => false))
  );
  const [clickable, setClickable] = useState(clickableCoeffs);
  const name = nameGen(numVar, numIneq, "x", "s");
  const handleClick = (i, j) => () => {
    onClick(i, j)();
    setClicked(
      range(numIneq).map((k) =>
        range(numVar + numIneq).map((l) => k === i && l === j)
      )
    );
    setClickable(
      range(numIneq).map((i) => range(numVar + numIneq).map((j) => false))
    );
  };
  return (
    <>
      <table>
        <thead>
          <tr>
            {range(numVar + numIneq).map((j) => (
              <th key={`th-${j}`}>{name(j)}</th>
            ))}
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, numIneq).map((row, i) => (
            <tr key={`tr-${i}`}>
              {row.map((c, j) => (
                <td
                  key={`td-${i}-${j}`}
                  className={tdClass(numVar, numIneq, clickable, clicked, i, j)}
                  onClick={clickable[i][j] ? handleClick(i, j) : () => null}
                >
                  {c.toFraction()}
                </td>
              ))}
              {<td>{name(labels[i])}</td>}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            {rows[numIneq].map((c, j) => (
              <th key={`th-${j}`} className={thClass(numVar, numIneq, j)}>
                {j === numVar + numIneq ? func(c) : c.toFraction()}
              </th>
            ))}
            <th></th>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

const func = (f) => {
  return (
    "f" + (f.n === 0 ? "" : f.s === -1 ? f.toFraction() : "+" + f.toFraction())
  );
};

const tdClass = (numVar, numIneq, clickable, clicked, i, j) =>
  [
    i === 0 ? "BorderTop" : "",
    i === numIneq - 1 ? "BorderBottom" : "",
    j === 0 || j === numVar || j === numVar + numIneq ? "BorderLeft" : "",
    j === numVar + numIneq ? "BorderRight" : "",
    clickable[i][j] ? "DiagramClickable" : "",
    clicked[i][j] ? "DiagramClicked" : "",
  ].join(" ");

const thClass = (numVar, numIneq, j) =>
  [
    "BorderBottom",
    j === 0 || j === numVar || j === numVar + numIneq ? "BorderLeft" : "",
    j === numVar + numIneq ? "BorderRight" : "",
  ].join(" ");

export default Diagram;

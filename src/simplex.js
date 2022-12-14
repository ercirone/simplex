import { range } from "./utils";
import Fraction from "fraction.js";

// Simplex method

const getInitialTable = (matrix, indep, func) => {
  const numIneq = matrix.length;
  const numVar = matrix[0].length;
  const labels = range(numIneq).map((x) => x + numVar);
  const rows = [
    ...range(numIneq).map((i) => [
      ...matrix[i],
      ...range(numIneq).map((j) => (j === i ? Fraction(1) : Fraction(0))),
      indep[i],
    ]),
    [...func, ...range(numIneq + 1).map((v) => Fraction(0))],
  ];
  return {
    rows: rows,
    labels: labels,
    title: "Diagrama simplex inicial",
    isFinal: isFinal(rows),
    isUnbounded: isUnbounded(rows),
    f: Fraction(0),
    x: range(numVar).map(i => Fraction(0)),
  };
};

const getPivotCoordsInColumn = (columnIndex, rows) => {
  // Returns a list of the "i-j" corresponding to possible pivots in the column columnIndex (i=row index; j=column index)
  const numIneq = rows.length - 1;
  const numVar = rows[0].length - numIneq - 1;
  const quotients = rows
    .slice(0, numIneq)
    .map((row, i) => [row[columnIndex], row[numVar + numIneq], i])
    .filter((t) => t[0] > 0)
    .map((t) => [t[1].div(t[0]), t[2]]);
  if (quotients.length === 0) {
    return [];
  }
  let min = quotients[0][0];
  for (let t of quotients) {
    if (t[0] < min) {
      min = t[0];
    }
  }
  return quotients
    .filter((t) => t[0].equals(min))
    .map((t) => `${t[1]}-${columnIndex}`);
};

const getPivotCoordsInTable = (rows) => {
  // Returns a list of the "i-j" corresponding to possible pivots in the table
  const numIneq = rows.length - 1;
  const numVar = rows[0].length - numIneq - 1;
  const pivots = rows[numIneq]
    .map((c, k) => [c, k])
    .filter((p) => p[1] < numVar + numIneq && p[0] > 0)
    .map((p) => p[1])
    .map((k) => getPivotCoordsInColumn(k, rows))
    .flat();
  return pivots;
};

const getClickableCoeffs = (rows) => {
  const numIneq = rows.length - 1;
  const numVar = rows[0].length - numIneq - 1;
  const pivots = getPivotCoordsInTable(rows);
  return range(numIneq).map((v, i) =>
    range(numVar + numIneq).map((c, j) => pivots.includes(`${i}-${j}`))
  );
};

const pivot = (table, i, j) => {
  const rows = table["rows"];
  const numIneq = rows.length - 1;
  const numVar = rows[0].length - numIneq - 1;
  const labels = table["labels"];
  const pivot = rows[i][j];
  const newRows = rows.map((row, k) =>
    k === i
      ? row.map((v, l) => v.div(pivot))
      : row.map((v, l) => v.sub(row[j].mul(rows[i][l]).div(pivot)))
  );
  const newLabels = labels.map((v, k) => (k === i ? j : v));
  const newF = newRows[numIneq][numVar+numIneq].mul(Fraction(-1));
  const newX = range(numVar).map(i => newLabels.includes(i) ? newRows[newLabels.indexOf(i)][numVar+numIneq]: Fraction(0));
  return {
    rows: newRows,
    labels: newLabels,
    title: `Despu??s de pivotear en ${pivot.toFraction()}`,
    isFinal: isFinal(newRows),
    isUnbounded: isUnbounded(newRows),
    f: newF,
    x: newX,
  };
};

const isFinal = (rows) => {
  const numIneq = rows.length - 1;
  const numVar = rows[0].length - numIneq - 1;
  return rows[numIneq].slice(0, numVar + numIneq).every(c => c <= 0);
};

const isUnbounded = (rows) => {
  const numIneq = rows.length - 1;
  const numVar = rows[0].length - numIneq - 1;
  const positive = rows[numIneq]
    .slice(0, numVar + numIneq)
    .map((c, i) => [c, i])
    .filter(t => t[0] > 0)
    .map(t => t[1]); // ??ndices que corresponden a columnas con indicadores positivos
  return positive.length > 0 && positive.every(i => getPivotCoordsInColumn(i,rows).length === 0);
}

const nameGen = (numVar, numIneq, originalVarName, slackVarName) => (k) =>
  k < numVar ? (
    <>
      {originalVarName}
      <sub>{k + 1}</sub>
    </>
  ) : (
    <>
      {slackVarName}
      <sub>{k - numVar + 1}</sub>
    </>
  );

export { getClickableCoeffs, pivot, nameGen, getInitialTable };

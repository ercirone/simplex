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
    return false;
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
    .filter((k) => getPivotCoordsInColumn(k, rows))
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
  const labels = table["labels"];
  const pivot = rows[i][j];
  const newRows = rows.map((row, k) =>
    k === i
      ? row.map((v, l) => v.div(pivot))
      : row.map((v, l) => v.sub(row[j].mul(rows[i][l]).div(pivot)))
  );
  const newLabels = labels.map((v, k) => (k === i ? j : v));
  return {
    rows: newRows,
    labels: newLabels,
  };
};

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

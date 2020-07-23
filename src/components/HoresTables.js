import React from "react";

const HoresTables = ({ tableRightTop, loading, availablePays }) => {
  //console.log(tableRightTop);

  if (loading) {
    return <h2>Loading...</h2>;
  } else if (availablePays) {
    return <h2>There are no will pays available.</h2>;
  } else if (tableRightTop.length == 0) {
    return " ";
  }
  return (
    <div>
      <table className="table table-dark">
        <thead>
          <tr>
            <th scope="col">Match</th>
            <th scope="col">Bs</th>
            <th scope="col">1</th>
          </tr>
        </thead>
        <tbody>
          {tableRightTop.map((match, index) => {
            return (
              <tr key={index}>
                <td>{match[0]}</td>
                <td>{match[1]}</td>
                <td>{match[2]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HoresTables;

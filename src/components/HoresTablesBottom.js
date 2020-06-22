import React from "react";

const HoresTables = ({ tableRightBottom, loading, availablePool }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (availablePool) {
    return <h2>There are no will pays available.</h2>;
  } else {
    return (
      <div>
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">Match</th>
              <th scope="col">Bs</th>
              <th scope="col">1</th>
              <th scope="col">Bs</th>
              <th scope="col">1</th>
            </tr>
          </thead>
          <tbody>
            {tableRightBottom.map((match, index) => {
              return (
                <tr key={index}>
                  <td>{match[0]}</td>
                  <td>{match[1]}</td>
                  <td>{match[2]}</td>
                  <td>{match[3]}</td>
                  <td>{match[4]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
};

export default HoresTables;

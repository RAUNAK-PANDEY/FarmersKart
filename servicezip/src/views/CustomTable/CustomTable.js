import React, { useState, useEffect } from "react";
import { Table } from "reactstrap";
import "./customtable.scss";

const CustomTable = ({ tableData }) => {
  // table data should be array of objects
  // where property names should be the headings of table
  return (
    <div style={{ overflow: "auto" }}>
      <Table>
        <thead className="table-heading">
          <tr>
            {tableData.length &&
              Object.keys(tableData[0]).map((title, index) => (
                <th key={index}>{title}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {tableData.length &&
            tableData.map((object, index) => (
              <tr key={index}>
                {Object.values(object).map((value, index) => (
                  <td key={index}> {value} </td>
                ))}
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CustomTable;

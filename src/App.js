import React, { useState } from 'react';
import XLSX from 'xlsx';

const App = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet);
      setData(excelData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSave = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'excel-data.xlsx');
  };

  const handleCellChange = (rowIndex, key, cellIndex, value) => {
    const updatedData = [...data];
    const keys = key[cellIndex];
    updatedData[rowIndex][keys] = value;
    setData(updatedData);
    console.log(rowIndex, keys, value);
  };

  return (
    <>
      <div style={{ }}>
        <input type="file" onChange={handleFileUpload} />
        <table>
          <thead>
            <tr>
              {data[0] &&
                Object.keys(data[0]).map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) =>
                        handleCellChange(
                          rowIndex,
                          Object.keys(row),
                          cellIndex,
                          e.target.value
                        )
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleSave}>Save</button>
      </div>
    </>
  );
};

export default App;

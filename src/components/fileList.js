import React, { useState, useEffect } from 'react';
import mockApiCall from '../services/fileService';
import './fileList.css';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await mockApiCall();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const isAllSelected = selectedItems.length === files.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(files.map(file => file.path));
    }
  };

  const toggleSelectItem = (path) => {
    setSelectedItems(prevSelected => {
      if (prevSelected.includes(path)) {
        return prevSelected.filter(item => item !== path);
      } else {
        return [...prevSelected, path];
      }
    });
  };

  const downloadSelected = () => {
    const nonAvailableFiles = selectedItems
      .map(path => files.find(file => file.path === path))
      .filter(file => file && file.status !== 'available');

    if (nonAvailableFiles.length > 0) {
      setErrorMessage('Error: Only those that have a status of "available" are currently able to be downloaded.');
    } else {
      const selectedFiles = files.filter(file => selectedItems.includes(file.path));
      const downloadInfo = selectedFiles.map(file => `Path: ${file.path}, Device: ${file.device}`).join('\n');
      alert(`Download selected files:\n${downloadInfo}`);
    }
  };

  return (
    <div>
      <div>
        {selectedItems.length > 0 ? `Selected ${selectedItems.length}` : 'None Selected'}
        <button onClick={downloadSelected} disabled={selectedItems.length === 0}>Download Selected</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
              />
            </th>
            <th>Name</th>
            <th>Device</th>
            <th>Path</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr
              onClick={() => toggleSelectItem(file.path)}
              key={index}
              className={selectedItems.includes(file.path) ? 'selected' : ''}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(file.path)}
                />
              </td>
              <td>{file.name}</td>
              <td>{file.device}</td>
              <td>{file.path}</td>
              <td>
                {file.status === 'available' && <span className="status-bubble"></span>}
                {file.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;

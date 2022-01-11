import React, { useEffect, useState } from 'react';

import { makeRequest } from './api';

const App = () => {
  const [path, setPath] = useState('');
  const [method, setMethod] = useState('GET');
  const [data, setData] = useState('');
  const [token, setToken] = useState('');
  const [contentType, setContentType] = useState('application/json');
  const [result, setResult] = useState('');
  const [request, setRequest] = useState('');
  const [type, setType] = useState(null);
  const [status, setStatus] = useState('');
  const [sessions, setSessions] = useState({});
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    updateSessionList();
  }, []);

  useEffect(() => {
    const key = makeKey(method, path);
    if (!!method && !!path) {
      const savedData = localStorage.getItem(key);
      if (!!savedData) {
        const d = JSON.parse(savedData);

        setPath(d.path);
        setMethod(d.method);
        setData(d.data);
        setToken(d.token);
        setContentType(d.contentType);
      }
    }
  }, [method, path]);

  const makeKey = (method, path) => method + ',' + path;

  const saveToLocalStorage = () => {
    const savedData = { path, method, data, token, contentType };
    localStorage.setItem(makeKey(method, path), JSON.stringify(savedData));
    updateSessionList();
  }

  const updateSessionList = () => {
    const savedData = localStorage;
    if (!!savedData) {
      const keys = Object.keys(savedData);
      const obj = {};
      keys.forEach(k => {
        obj[k] = savedData[k];
      });
      setSessions(obj);
      setKeys(keys);
    }
  }

  const handleSubmit = () => {
    saveToLocalStorage();

    makeRequest(path, method, data, token, contentType)
      .then(({ request, response, type, status }) => {
        setResult(response);
        setRequest(request);
        setType(type);
        setStatus(status);
      });
  }

  const handleLoad = (key) => {
    const d = JSON.parse(sessions[key]);

    setPath(d.path);
    setMethod(d.method);
    setData(d.data);
    setToken(d.token);
    setContentType(d.contentType);
  }

  const handleDeleteKey = (key) => {
    localStorage.removeItem(key);
    updateSessionList();
  }

  const formatKey = (key) => {
    const arr = key.split(',');
    return `${arr[0]} ${arr[1]}`;
  }

  return <>
    <div className="layout">
      <div>
        <div className="box">
          Path: <br />
          <input value={path} onChange={e => setPath(e.target.value)} />
        </div>
        <div className="box">
          Method: <br />
          <select value={method} onChange={(e) => setMethod(e.target.value)} >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
            <option>DELETE</option>
          </select>
        </div>
        <div className="box">
          Data: <br />
          <textarea rows="8" value={data} onChange={e => setData(e.target.value)} />
        </div>
        <div className="box">
          Token: <br />
          <input value={token} onChange={e => setToken(e.target.value)} />
        </div>
        <div className="box">
          Content type: <br />
          <input value={contentType} onChange={e => setContentType(e.target.value)} />
        </div>

        <button onClick={handleSubmit}>Submit</button>

        <div className="sessions">
          <strong>Sessions:</strong>
          {keys.map(key =>
            <div key={key} className="session">
              <button onClick={() => handleLoad(key)}>Load</button>
              &nbsp;
              <button onClick={() => handleDeleteKey(key)}>Del</button>
              &nbsp;
              {formatKey(key)}
            </div>)
          }
        </div>
      </div>

      <div className="right">
        {result &&
          <>
            <div className="small">Response:</div>
            <pre className="result" >
              {type === 'json'
                ? JSON.stringify(result)
                : <span style={{ fontSize: '10px' }}>{result}</span>}
            </pre></>}

        {request &&
          <>
            <div className="small">Request:</div>
            <pre className="result">{JSON.stringify(request)}</pre>
          </>}

        {status && <>
          <div className="small">Status:</div>
          <pre className="result">{status}</pre>
        </>}

      </div>
    </div>
  </>
}

export default App;

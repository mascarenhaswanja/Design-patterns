import React, { useState } from 'react';

const ipfsClient = require("ipfs-http-client");
const ipfsApi = ipfsClient("http://localhost:5001");

function FileUpload() {
  const [fileHash, setFileHash] = useState(null);

  const readFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.onloadend = () => uploadIpfs(reader)
    reader.readAsArrayBuffer(file)
  }

  const uploadIpfs = async (reader) => {
    const buffer = Buffer.from(reader.result)
    for await (const res of ipfsApi.add(buffer)) {
      setFileHash(res.path);
    } 
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
      <div>
        <header>
          <h1>IPFS - Upload/Download File</h1>
        </header>
        <br/>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={readFile} />
        </form>
        <div>
          <a href={'https://ipfs.io/ipfs/' + fileHash}>  {fileHash}
          </a>
        </div>
        <hr />
        <br/>
        <input type="text" placeholder="Use the File Hash to get from IPFS" />
        <a
          href={`http://localhost:8080/ipfs/${fileHash}`}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
        <button className="download">
          <i className="fas fa-download" />
            Download From IPFS network
        </button>
        </a>
      </div>
  );
}
export default FileUpload;
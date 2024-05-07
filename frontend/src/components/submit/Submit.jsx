import React, { useState } from 'react';
import './Submit.css';
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["ZIP"];

function Submit() {
  const [file, setFile] = useState(null);

  const handleChange = (file) => {
    console.log("File selected:", file);
    setFile(file);
  };

  console.log("File state:", file);

  return (
    <div>
      <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
      {file && <img src={file.preview} alt="Uploaded file" />}
    </div>
  );
}

export default Submit;

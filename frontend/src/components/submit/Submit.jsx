import React, { useState } from "react";
import api from '../../api';
import { redirect } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function Submit() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const navigate = useNavigate();


  const uploadHandler = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      api.post('submit/upload_file/', formData)
        .then(response => {
          console.log(response.data);
          // Handle success response
        })
        .catch(error => {
          console.error('Error uploading file:', error);
          // Handle error response
        });
        // alert("Successfully submitted file!");
        // navigate('/home');
      }
  };

  return (
    <div className="Submit">
      <label>Select a File</label>
      <input
        type="file"
        accept=".zip,.rar,.7zip"
        onChange={handleFileChange}
      />
      <button onClick={uploadHandler}>Upload File</button>
    </div>
  );
}

export default Submit;

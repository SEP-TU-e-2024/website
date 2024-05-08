import React, { useState } from "react";
import api from '../../api';
import { redirect } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function Submit() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    //
    setFile(event.target.files[0]);
  };
  const navigate = useNavigate();


  const uploadHandler = () => {
    if (file) {

      // Check file type
      if (!['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'].includes(file.type)) {
        console.error('Invalid file type.');
        alert("Invalid file type. Please upload a .zip, .rar, or .7zip file.")
        return;
      }
   
      // Check file name length
      if (file.name.length > 50) {
        console.error('File name exceeds 50 characters.');
        alert("File name exceeds 50 characters.")
        return;
      }
      // Check file size
      if (file.size > 50 * 1024 * 1024) { // 50 MB in bytes
        console.error('File size exceeds 50MB.');
        alert("File size exceeds 50MB.")
        return;
      }
      
  
      const formData = new FormData();
      formData.append('file', file);
  
      api.post('submit/upload_file/', formData)
        .then(response => {
          console.log(response.data);
          // Handle success response
          // alert("Successfully submitted file!");
          // navigate('/home');
        })
        .catch(error => {
          console.error('Error uploading file:', error);
          // Handle error response
        });
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
      {/* <></> */}
      <button onClick={uploadHandler}>Upload File</button>
    </div>
  );
}

export default Submit;

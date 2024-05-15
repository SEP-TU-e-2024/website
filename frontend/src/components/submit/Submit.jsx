import React, { useState, useContext} from "react";
import api from '../../api';
import { redirect } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import AuthContext from "../../context/AuthContext";

function Submit() {
  let {user} = useContext(AuthContext)
  const navigate = useNavigate();

  let checkFileType = (file)=> {
    /**
     * Checks file for valid type
     * 
     * @param {JSON} file - File to check
     * @returns {boolean} - Whether type is allowed.
     */
    let file_extension = file.name.split('.').pop().toLowerCase();
    if (!['zip', 'rar', '7zip'].includes(file_extension)) {
      console.error('Invalid file type.');
      alert("Invalid file type. Please upload a .zip, .rar, or .7zip file.")
      return false;
    }
    return true;
  }

  let checkFileName = (file)=> {
    /**
     * Checks file for valid name
     * 
     * @param {JSON} file - File to check
     * @returns {boolean} - Whether name is allowed.
     */
    if (file.name.length > 50) {
      console.error('File name exceeds 50 characters.');
      alert("File name exceeds 50 characters.")
      return false;
    }
    return true;
  }

  let checkFileSize = (file)=> {
    /**
     * Checks file for valid size
     * 
     * @param {JSON} file - File to check
     * @returns {boolean} - Whether size is allowed.
     */
    if (file.size > 50 * 1024 * 1024) { // 50 MB in bytes
      console.error('File size exceeds 50MB.');
      alert("File size exceeds 50MB.")
      return false;
    }
    return true;
  }

  let uploadHandler = async (e) => {
    /**
     * Handles submission of code
     * 
     * @param {JSON} file - File to check
     * @returns {boolean} - Whether type is allowed.
     */

    // Prevent default submit behaviour
    e.preventDefault()
    const file = e.target.file.files[0]

    // Checks for file existence
    if (!file) {
      alert("No file provided")
      return;
    }

    // Checks file properties
    if (!checkFileType(file) || !checkFileName(file) || !checkFileSize(file)) {
      return;
    }

    try {
      // Formats data for backend 
      const formData = new FormData();
      formData.append('file', file);
      formData.append('submission_name', e.target.submission_name.value);
      e.target.email ? formData.append('email', e.target.email.value) : formData.append('email', null)  

      // POST request to backend
      let response = await api.post('/submit/upload_submission/', formData);
      // Receives submission status and notifies user adequately
      if (response.status === 200) {
        !user ? alert("Check your email to confirm submission") : alert("Submission uploaded successfully.");
      } 
    } catch (error) {
      // Handle errors
      if (error.response.data.error) {
          alert(error.response.data.error)
          return
      }
      alert(error.message);
      console.error('Singup error:', error.message);
  }
  };
  
  return (
    <>
    <div className='submit_container'>
      <form onSubmit={uploadHandler} method='post'>
        {!user ? (<div>
          <input
            name="email"
            type="text"
            placeholder={"Email"}/>
        </div>) : undefined } 
        <div>
          <input
            name="submission_name"
            type="text"
            placeholder={"Submission Name"}
            required/>
        </div>
        <div>
          <label>Select a File</label>
          <input
            name="file"
            type="file"
            accept=".zip,.rar,.7zip"
            required
          />
        </div>

        <button type="submit"> Submit solution </button>
      </form>
    </div>
</>
  );
}

export default Submit;

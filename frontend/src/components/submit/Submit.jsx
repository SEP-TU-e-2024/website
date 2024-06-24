import React, { useState, useContext, useRef } from "react";
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../../context/AuthContext";
import { FileUploader } from "react-drag-drop-files";
import './Submit.scss'
import { useAlert } from "../../context/AlertContext";

function Submit() {
  let { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [isDownloadable, setIsDownloadable] = useState(false);
  const fileTypes = ["ZIP", "RAR", "7Z"];
  let { showAlert } = useAlert();

  const handleCheckboxChange = () => {
    setIsDownloadable(!isDownloadable);
  };

  const checkFileType = (file) => {
    let file_extension = file.name.split('.').pop().toLowerCase();
    if (!['zip', 'rar', '7z'].includes(file_extension)) {
      console.error('Invalid file type.');
      showAlert("Invalid file type. Please upload a .zip, .rar, or .7z file.", "error");
      return false;
    }
    return true;
  };

  const checkFileName = (file) => {
    if (file.name.length > 50) {
      console.error('File name exceeds 50 characters.');
      showAlert("File name exceeds 50 characters.", "error");
      return false;
    }
    return true;
  };

  const checkFileSize = (file) => {
    if (file.size > 50 * 1024 * 1024) { // 50 MB in bytes
      console.error('File size exceeds 50MB.');
      showAlert("File size exceeds 50MB.", "error");
      return false;
    }
    return true;
  };

  const handleChange = (file) => {
    setFile(file);
  };

  const uploadHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      showAlert("No file provided", "error");
      return;
    }

    if (!checkFileType(file) || !checkFileName(file) || !checkFileSize(file)) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', e.target.submission_name.value);
      formData.append('problem', window.location.pathname.split('/').pop());
      e.target.email ? formData.append('email', e.target.email.value) : formData.append('email', "useremailhere@mail.com");
      formData.append('is_downloadable', isDownloadable);
      
      let response = await api.post('/submit/', formData);

      if (response.status === 200) {
        !user ? showAlert("Check your email to confirm submission", "success") : showAlert("Submission uploaded successfully.", "success");
      }
    } catch (error) {
      if (error.response.data.detail) {
        showAlert(error.response.data.detail, "error");
      } else if (error.response.status == 400) {
        showAlert("Invalid submission", "error")
      } else if (error.response.status == 500) {
        showAlert("Something went wrong on the server", "error")
      }
      console.error('Submission error');
    }
  };

  return (
    <>
      <div className='submit_container'>
        <form onSubmit={uploadHandler} method='post'>
          {!user ? (
            <div className='field_container'>
              <input
                name="email"
                type="text"
                placeholder={"Email"} />
            </div>
          ) : undefined}
          <div className='field_container'>
            <input
              name="submission_name"
              type="text"
              placeholder={"Submission Name"}
              required />
          </div>
          <div className="upload_container">
            <FileUploader handleChange={handleChange} name="file" types={fileTypes} children={
              <div>
                {file ? <div>{file.name}</div> : undefined}
                <i className="bi bi-upload" />
                <p> Drag and drop a file </p>
                <button className="upload_button"> 
                  Browse
                </button>
              </div>
            }/>
          </div> 
          <div>
            <label>
              <input
                type="checkbox"
                checked={isDownloadable}
                onChange={handleCheckboxChange}
              />
              Make submission downloadable to other users
            </label>
          </div>
          <button type="submit" className="submit_button">Submit solution</button>
        </form>
      </div>
    </>
  );
}

export default Submit;

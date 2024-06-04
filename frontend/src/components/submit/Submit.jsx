import React, { useState, useContext } from "react";
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../../context/AuthContext";

function Submit() {
  let { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDownloadable, setIsDownloadable] = useState(false);

  const handleCheckboxChange = () => {
    setIsDownloadable(!isDownloadable);
  };

  const checkFileType = (file) => {
    let file_extension = file.name.split('.').pop().toLowerCase();
    if (!['zip', 'rar', '7z'].includes(file_extension)) {
      console.error('Invalid file type.');
      alert("Invalid file type. Please upload a .zip, .rar, or .7z file.");
      return false;
    }
    return true;
  };

  const checkFileName = (file) => {
    if (file.name.length > 50) {
      console.error('File name exceeds 50 characters.');
      alert("File name exceeds 50 characters.");
      return false;
    }
    return true;
  };

  const checkFileSize = (file) => {
    if (file.size > 50 * 1024 * 1024) { // 50 MB in bytes
      console.error('File size exceeds 50MB.');
      alert("File size exceeds 50MB.");
      return false;
    }
    return true;
  };

  const uploadHandler = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];

    if (!file) {
      alert("No file provided");
      return;
    }

    if (!checkFileType(file) || !checkFileName(file) || !checkFileSize(file)) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('submission_name', e.target.submission_name.value);
      formData.append('problem_id', window.location.pathname.split('/').pop());
      e.target.email ? formData.append('email', e.target.email.value) : formData.append('email', "useremailhere@mail.com");
      formData.append('is_downloadable', isDownloadable);
      
      let response = await api.post('/submit/upload_submission/', formData);

      if (response.status === 200) {
        !user ? alert("Check your email to confirm submission") : alert("Submission uploaded successfully.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
        return;
      }
      alert(error.message);
      console.error('Submission error:', error.message);
    }
  };

  return (
    <>
      <div className='submit_container'>
        <form onSubmit={uploadHandler} method='post'>
          {!user ? (
            <div>
              <input
                name="email"
                type="text"
                placeholder={"Email"} />
            </div>
          ) : undefined}
          <div>
            <input
              name="submission_name"
              type="text"
              placeholder={"Submission Name"}
              required />
          </div>
          <div>
            <label>Select a File</label>
            <input
              name="file"
              type="file"
              accept=".zip,.rar,.7z"
              required
            />
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
          <button type="submit">Submit solution</button>
        </form>
      </div>
    </>
  );
}

export default Submit;

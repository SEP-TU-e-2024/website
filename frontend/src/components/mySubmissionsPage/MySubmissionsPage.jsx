import {React, useEffect, useState} from "react"
import api from "../../api";

/**
 * Page component for an overview of all submissions made by a user
 */
function MySubmissionsPage() {
  const [email, setEmail] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        console.log(data);
        setEmail(data.email);
      } catch(error) {
        alert(error.message);
        console.error(error);
      }
    } 
    fetchUser();
  },[])
  //TODO: get user somehow
  
  return (
    <div>
      <p>
        {email}
      </p>
    </div>
  )
};

/**
 * Fetches user from the backend
 * @returns data, array 
 */
async function getUser() {
  try {
    let response = await api.get('/account')
    return response.data
  } catch(error) {
    
  }
}

export default MySubmissionsPage;

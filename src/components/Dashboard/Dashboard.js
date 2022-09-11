import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [users, setUsers] = useState([]);

  function getUsers() {
    axios
      .get("https://home-app-function.azurewebsites.net/api/HomeManager")
      //.get("http://localhost:7055/api/GetUsers")
      // .then(response => response.data)
      .then((response) => {
        setUsers(response.data);
        console.log(response.data)
        //setIsLoading(false);
      });
  }
  useEffect(() => {
    getUsers();
  }, []);

  function goToProfile(id){
    window.location = `/week/${id}`;
  }
  return (
    <div className="main-black-container">
      <h1 className="text-center mb-5">Select a Profile</h1>
      <div className="row">
        {users.map((i) => {
          return (
          <div className="col-lg-4 mb-5 text-center">
          {/* <img src={i.picture} className="w-25 m-auto bg-primary mb-1 rounded-circle"/> */}
            <div onClick={()=>{goToProfile(i.id)}} className="w-50 m-auto mb-5 bg-primary  rounded-circle" style={{ backgroundImage: `url(${i.picture})`, height:'15vw', backgroundRepeat: 'no-repeat', backgroundSize: "cover"}}>
              
            </div>
            <h5 className="mt-0 ">{i.name}</h5>
          </div>)
        })}
      </div>
    </div>
  );
}

export default Dashboard;

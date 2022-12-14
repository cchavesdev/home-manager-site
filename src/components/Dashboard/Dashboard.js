import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [users, setUsers] = useState([]);

  function getUsers() {
    axios
      .get("https://home-app-function.azurewebsites.net/api/HomeManager")
      // .get("http://localhost:7055/api/HomeManager")
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
      <h1 className="text-center mb-3">Select a Profile</h1>
      <div className="row justify-content-center">
        {users.map((i) => {
          return (
          <div className="col-12 col-lg-4 mb-5 text-center p-3">
        
            <div onClick={()=>{goToProfile(i.id)}} className="m-auto rounded-circle">
            <img alt="Users Profile" src={i.picture} className="w-75 m-auto bg-primary mb-1 rounded-circle"/> 
            </div>
            <h5 className="mt-0 ">{i.name}</h5>
          </div>)
        })}
          <div className="col-12 col-lg-4 mb-5 text-center p-3">
          
            <div onClick={()=>{window.location.href = "/shopping"}} className="m-auto rounded-circle">
            <img alt="Users Profile" src="/img/shopping.jpg" className="w-75 m-auto bg-primary mb-1 rounded-circle"/> 
            </div>
            <h5 className="mt-0 ">Shopping List</h5>
          </div>
      </div>
    </div>
  );
}

export default Dashboard;

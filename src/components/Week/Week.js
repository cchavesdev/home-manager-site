import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import AddTask from "../AddTask/AddTask";

function Week(props) {
  const [user, setUser] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tuesdayTask, setTuesdayTasks] = useState([]);
 
  let { id } = useParams();

  function getUserData() {
    console.log(id);
    axios
      .get(`https://home-app-function.azurewebsites.net/api/getuserdata/${id}`)
      .then((response) => {
        setUser(response.data[0]);
        setTasks(response.data[0].tasks);
      });
  }

  useEffect(() => {
    getUserData();
  }, []);

  function loadDayTasks(dayOfTheWeek) {
    console.log(tasks);
    return tasks.map((element) => {
      if (element.dayOfTheWeek == dayOfTheWeek) {
        let completedClass = element.isCompleted ?  "completed" :"";
        return (
           
          <li onClick={handleClick} task={element.id} className={completedClass}>
           {element.title}
          </li>
        );
      }
    });
  }
  
  function handleClick(e){
    
    let newTasksSet = [...tasks];
    newTasksSet.map((task)=>{
        if(task.id ==  e.target.getAttribute("task")){
            task.isCompleted = !task.isCompleted;
            e.target.classList.toggle("completed");
        }

       
    });
    console.log(newTasksSet);
    axios.put(`http://localhost:7055/api/updateuser/${id}`, {tasks:newTasksSet})
    .then(response=>{
       console.log(response);
    });
  }

  return (
    <div className="main-black-container p-3">
      {/* <h1>Monday {user.name}</h1>
            <ul>
                {
                    mondayTask
                }
            </ul>
            <h1>Tuesday {user.name}</h1>
            <ul>
                {
                    tuesdayTask
                }
            </ul> */}
      <div className="d-flex justify-content-between mb-5">
        <div className="day-box flex-fill green-border">
          <h4>Monday</h4>
          <ul>
            { loadDayTasks("Monday")}
          </ul>
        </div>
        <div className="day-box flex-fill">
        <h4>Tuesday</h4>
          <ul>
            { loadDayTasks("Tuesday")}
          </ul>
        </div>
        <div className="day-box flex-fill">
        <h4>Wednesday</h4>
          <ul>
            { loadDayTasks("Wednesday")}
          </ul>
        </div>
        <div className="day-box flex-fill">
        <h4>Thursday</h4>
          <ul>
            { loadDayTasks("Thursday")}
          </ul>
        </div>
       
      </div>
      <div className="d-flex justify-content-around">
      <div className="day-box flex-fill">
        <h4>Friday</h4>
          <ul>
            { loadDayTasks("Friday")}
          </ul>
        </div>
        <div className="day-box flex-fill day-box">
        <h4>Saturday</h4>
          <ul>
            { loadDayTasks("Saturday")}
          </ul>
        </div>
        <div className="day-box flex-fill day-box">
        <h4>Sunday</h4>
          <ul>
            { loadDayTasks("Sunday")}
          </ul>
        </div>
      </div>
     
      <AddTask currentTasks={tasks} userId={id}></AddTask>
    </div>
  );
}

export default Week;
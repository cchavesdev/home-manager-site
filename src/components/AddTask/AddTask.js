import axios from "axios";
import { useState } from "react";

function AddTask(props) {
  const initialDayOfWeeks = [
    { dayOfTheWeek: "Monday", selected: false },
    { dayOfTheWeek: "Tuesday", selected: false },
    { dayOfTheWeek: "Wednesday", selected: false },
    { dayOfTheWeek: "Thursday", selected: false },
    { dayOfTheWeek: "Friday", selected: false },
    { dayOfTheWeek: "Saturday", selected: false },
    { dayOfTheWeek: "Sunday", selected: false },
  ];

  const [daysOfWeek, setDaysOfWeek] = useState(initialDayOfWeeks);

  function loadDayOfWeek() {
    return daysOfWeek.map((dayOfWeek) => {
      let selectedClass = dayOfWeek.selected ? "bg-success" : "bg-secondary";
      return (
        <div
          className={`d-block  p-1   col-4 mb-3`}
          onClick={() => {
            HandleClickDaysOfWeek(dayOfWeek);
          }}
        >
          <span className={`d-block w-100 text-center day rounded ${selectedClass}`}>{dayOfWeek.dayOfTheWeek}</span>
        </div>
      );
    });
  }
  function HandleClickDaysOfWeek(daySelected) {
    let newSelectedDay = [...daysOfWeek];
    let index = newSelectedDay.findIndex(
      (x) => x.dayOfTheWeek === daySelected.dayOfTheWeek
    );
    newSelectedDay[index].selected = !newSelectedDay[index].selected;
    setDaysOfWeek(newSelectedDay);
    // console.log({e: e, day:daySelected});
  }

  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  function submitTask() {
    // console.log(props.currentTasks);
    let newTaskList = [...props.currentTasks];
    let taskTitle = document.getElementById("taskTitle").value;
    if(taskTitle){
        daysOfWeek.forEach((dayOfWeek) => {
           if(dayOfWeek.selected){
            newTaskList = [...newTaskList, {
                id: uuid(),
                title: taskTitle,
                isCompleted: false,
                dayOfTheWeek: dayOfWeek.dayOfTheWeek
            }];
           }
          });
    }
   
    console.log(newTaskList);
    axios
    // .put(`http://localhost:7055/api/updateuser/${props.userId}`, {tasks:newTaskList})
    .put(`https://home-app-function.azurewebsites.net/api/updateuser/${props.userId}`, {tasks:newTaskList})
    .then(response=>{
       console.log(response);
       window.location = `/week/${props.userId}`;
    });
  }

  return (
    <div>
      <button
      id="addButton"
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
       +
      </button>

      <div
        className="modal fade"
        id="exampleModal"       
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
              What are you going to do?
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-row col-md-4 m-auto mb-3">
                <input
                  type="text"
                  className="form-control col-md-4"
                  id="taskTitle"
                  placeholder="write your goal here!"
                />
              </div>
              <div className="days-selector-container d-flex justify-content-around row">
                {loadDayOfWeek()}
              </div>
            </div>
            <div className="modal-footer">
             
              <button
                onClick={submitTask}
                type="button"
                className="btn btn-success"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTask;

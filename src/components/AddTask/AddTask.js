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
          className={`day d-block p-1 rounded ${selectedClass}`}
          onClick={() => {
            HandleClickDaysOfWeek(dayOfWeek);
          }}
        >
          <span>{dayOfWeek.dayOfTheWeek}</span>
        </div>
      );
    });
  }
  function HandleClickDaysOfWeek(daySelected) {
    let newSelectedDay = [...daysOfWeek];
    let index = newSelectedDay.findIndex(
      (x) => x.dayOfTheWeek == daySelected.dayOfTheWeek
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
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  function submitTask() {
    // console.log(props.currentTasks);
    let newTaskList = [...props.currentTasks];
    let taskTitle = document.getElementById("taskTitle").value;
    if(taskTitle){
        daysOfWeek.map((dayOfWeek) => {
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
    axios.put(`http://localhost:7055/api/updateuser/${props.userId}`, {tasks:newTaskList})
    .then(response=>{
       console.log(response);
       window.location = `/week/${props.userId}`;
    });
  }

  return (
    <div>
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
       +
      </button>

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
              What are you going to do?
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="form-row col-md-4 m-auto mb-3">
                <input
                  type="text"
                  className="form-control col-md-4"
                  id="taskTitle"
                  placeholder="write your goal here!"
                />
              </div>
              <div className="days-selector-container d-flex justify-content-between">
                {loadDayOfWeek()}
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={submitTask}
                type="button"
                class="btn btn-primary"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTask;

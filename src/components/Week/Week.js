import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import AddTask from "../AddTask/AddTask";
import GoBackButton from "../GoBack/GoBackButton";
// import WeekProgressDashboard from "../WeekProgressDashboard/WeekProgressDashboard";

function Week(props) {
  const [tasks, setTasks] = useState([]);
  const [draggableTask, setDraggableTask] = useState({});

  let { id } = useParams();

  useEffect(() => {
    function getUserData() {
      axios
        .get(
          `https://home-app-function.azurewebsites.net/api/getuserdata/${id}`
        )
        // .get(
        //   `http://localhost:7055/api/getuserdata/${id}`
        // )
        .then((response) => {
          setTasks(response.data[0].tasks);
        });
    }
    getUserData();
  }, [id]);

  function loadDayTasks(dayOfTheWeek) {
    return tasks.map((element, index) => {
      let completedClass = element.isCompleted
        ? "completed draggable"
        : "draggable";
      return element.dayOfTheWeek === dayOfTheWeek ? (
        <li
          key={index}
          onClick={handleClick}
          task={element.id}
          className={completedClass}
          draggable="true"
          onDragStart={(e) => {
            onDragStart(e, element);
          }}
          onTouchMove={(e) => {
            onDragStart(e, element);
          }}
        >
          {element.title}
          <span
            onClick={() => {
              deleteTask(element.id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-trash3-fill"
              viewBox="0 0 16 16"
            >
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
            </svg>
          </span>
        </li>
      ) : (
        ""
      );
    });
  }

  function deleteTask(id) {
    let newTasks = tasks.filter((x) => x.id !== id);
    setTasks(newTasks);
    updateTaskDb(newTasks);
  }

  function handleClick(e) {
    let newTasksSet = [...tasks];
    newTasksSet.forEach((task) => {
      if (task.id === e.target.getAttribute("task")) {
        task.isCompleted = !task.isCompleted;
        e.target.classList.toggle("completed");
        updateTaskDb(newTasksSet);
      }
    });
  }
  function onDragOver(e) {
    e.preventDefault();
    console.log(e.target );
    if(e.target.classList.contains("task-container") || e.target.classList.contains("draggable")){//making sure we don't do anything on children elements (propagation)
      let container;
      if (e.target.classList.contains("draggable")) {
        container = e.target.parentElement;
      } else {
        container = e.target;
      }
  
      var draggableItems = Array.from(container.querySelectorAll(".draggable:not(.dragging)"));
      var selectedItem = draggableItems.find((dragElement) => {
        return e.clientY <= dragElement.getBoundingClientRect().top;
      });
  
      if (selectedItem) {
        container.insertBefore(draggableTask.htmlElement, selectedItem);
      } else {
        container.appendChild(draggableTask.htmlElement);
      }
    }
   
  }
  function onDragStart(e, element) {
    console.log( e.target);
    e.target.classList.add("dragging");
    setDraggableTask({ task: element, htmlElement: e.target });
  }
  function onDrop(e, dayOfWeek) {
    let taskList = [...tasks];
    taskList.forEach((task) => {
      if (task.id === draggableTask.task.id) {
        task.DayOfTheWeek = dayOfWeek;
       // updateTaskDb(taskList);
       document.getElementsByClassName("dragging")[0].classList.remove("dragging");
      }
    });
    setDraggableTask({});
  }
  function updateTaskDb(newTasksSet) {
    axios
      .put(`https://home-app-function.azurewebsites.net/api/updateuser/${id}`, {
        tasks: newTasksSet,
      })
      // .put(`http://localhost:7055/api/updateuser/${id}`, {
      //   tasks: newTasksSet,
      // })
      .then((response) => {
        console.log(response);
      });
  }

  function loadDayOfWeekHtml() {
    let DayOfWeeks = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return DayOfWeeks.map((day, index) => {
      return (
        <div key={index} className="col-12 col-md col-lg day-box mb-3">
          <h6>{day}</h6>

          <div className="">
            <ul
              className="task-container"
              onDragOver={onDragOver}
              onDrop={(e) => {
                onDrop(e, day);
              }}
             
            >
              {loadDayTasks(day)}
            </ul>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="main-black-container p-3">
      <div>
        <GoBackButton></GoBackButton>
        {/* <WeekProgressDashboard></WeekProgressDashboard> */}
        <h3 className="text-center">Weekly Planning</h3>
      </div>
      <div className="row justify-content-around mb-5">
        {loadDayOfWeekHtml()}
      </div>

      <AddTask currentTasks={tasks} userId={id}></AddTask>
    </div>
  );
}

export default Week;

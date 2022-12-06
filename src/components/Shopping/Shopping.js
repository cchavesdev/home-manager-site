import React, { useEffect, useState } from "react";

import axios from "axios";
import GoBackButton from "../GoBack/GoBackButton";
// import WeekProgressDashboard from "../WeekProgressDashboard/WeekProgressDashboard";

function Shopping(props) {
  const [shoppingLists, setShoppingLists] = useState([]);
  

  useEffect(() => {
    function getShoppingLists() {
      axios
        .get(`https://home-app-function.azurewebsites.net/api/getshoppinglists`)
        .then((response) => {
          setShoppingLists(response.data);
          console.log(response.data);
        });
    }
    getShoppingLists();
  }, []);

  function loadItem(items, shoppingListId) {
    return items.map((element, index) => {
      let completedClass = element.isCompleted
        ? "completed draggable"
        : "draggable";

      return (
        <li
          key={index}
          onClick={handleClick}
          itemID={element.id}
          shoppinglistid={shoppingListId}
          className={completedClass}
        >
          {element.name}
          <span
            onClick={() => {
              deleteItem(shoppingListId, element.id);
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
      );
    });
  }

  function deleteItem(listId, itemId) {
    let newShopLists = [...shoppingLists];
    newShopLists.forEach((list) => {
      if (list.id === listId) {
        list.items = list.items.filter((x) => x.id !== itemId);
      }
    });
    updateShopListCosmoDb(
      listId,
      newShopLists.find((x) => x.id === listId)
    );
    setShoppingLists(newShopLists);
  }

  function handleClick(e) {
    console.log(e.target);
    let itemId = e.target.getAttribute("itemid");
    let shoppingListId = e.target.getAttribute("shoppinglistid");
    console.log({ itemId: itemId, shoppingListId: shoppingListId });
    let newShoppingListsValues = [...shoppingLists];

    newShoppingListsValues.forEach((shoppingList) => {
      if (shoppingList.id === shoppingListId) {
        shoppingList.items.forEach((shopItem) => {
          if (shopItem.id === itemId) {
            shopItem.isCompleted = !shopItem.isCompleted;
            e.target.classList.toggle("completed");
            console.log(shopItem);
            updateShopListCosmoDb(shoppingListId, shoppingList);
          }
        });
      }
    });

    setShoppingLists(newShoppingListsValues);
  }

  function updateShopListCosmoDb(shoppingListId, shoppingList) {
    axios
    // .put(
    //   `http://localhost:7055/api/updateshoppinglist/${shoppingListId}`,
    //   shoppingList
    // )
      .put(
        `https://home-app-function.azurewebsites.net/api/updateshoppinglist/${shoppingListId}`,
        shoppingList
      )
      .then((response) => {
        console.log(response);
      });
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
  function addShopItem(shoppingListId) {
    let newItemValue = document.getElementById(
      "listInput" + shoppingListId
    );
  
    let newShopList = [...shoppingLists];
    let shopListToAdd = newShopList.find((x) => x.id === shoppingListId);
    shopListToAdd.items.push({
      id: uuid(),
      name: newItemValue.value,
      isCompleted: false,
    });
   
    axios
    // .put(
    //   `http://localhost:7055/api/updateshoppinglist/${shoppingListId}`,
    //   shopListToAdd
    // )
      .put(
        `https://home-app-function.azurewebsites.net/api/updateshoppinglist/${shoppingListId}`,
        shopListToAdd
      )
      .then((response) => {
        setShoppingLists(newShopList);
        newItemValue.value = "";
      });
  }

  function loadShoppingListHtml() {
    return shoppingLists.map((list, index) => {
      return (
        <div key={index} className="col-12 col-md col-lg day-box mb-3">
          <h6>{list.name}</h6>

          <div className="">
            <ul className="task-container">
              {loadItem(list.items, list.id)}
              <li>
                <input id={"listInput" + list.id} className="add-shop-input" placeholder="Add Item" />{" "}
                <span
                  onClick={(e) => {
                    addShopItem(list.id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-plus-square"
                    viewBox="0 0 16 16"
                  >
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                </span>
              </li>
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
        <h3 className="text-center">Shopping</h3>
      </div>
      <div className="row justify-content-around mb-5">
        {loadShoppingListHtml()}
      </div>
    </div>
  );
}

export default Shopping;

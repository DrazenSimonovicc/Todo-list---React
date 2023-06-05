import React, { useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = React.useState("");
  const [list, setList] = React.useState(getLocalStorage());
  const [isEditing, setIsEditing] = React.useState(false); //da li se edituje (ako je f pise sub, a ako je t pise edit)
  const [editID, setEditID] = React.useState(null); //da oznacimo tacno onaj koji editujemo
  const [alert, setAlert] = React.useState({
    show: false,
    msg: "",
    type: "",
  }); //da kada ubacimo ili izbrisemo pojavi neki alert

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "danger", "Please enter value");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return {
              ...item,
              title: name,
            };
          }
          return item;
        })
      );
      setName("");
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", "Value changed");
    } else {
      showAlert(true, "success", "Item added to the list");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]); //daj mi sve vrednosti iz statea i dodaj novu
      setName("");
    }
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show: show, type, msg });
  }; //napravljena f-ja za pokazivanje alerta prilikom unosa, zbog preglednosti

  const clearList = () => {
    showAlert(true, "danger", "Empty list");
    setList([]);
  };
  const removeItem = (id) => {
    showAlert(true, "danger", "Item removed");
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <div className="title-box">
        <h3>To do list</h3>
        <p className="text">Made by Drazen Simonovic in 2023.</p>
      </div>
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}

        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. buy eggs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <div className="clear-btn-c">
            <button className="clear-btn" onClick={clearList}>
              clear items
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default App;

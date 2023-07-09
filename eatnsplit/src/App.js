import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setAddFriend] = useState(false);
  const [getAddFrdData, setAddFrdData] = useState(initialFriends);
  const [selectedFrd, setSelectedFrd] = useState(null);

  function handleShowAddFriend() {
    setAddFriend((show) => !show);
  }

  const handleAddFriend = function (friend) {
    setAddFrdData((friends) => [...friends, friend]);
    handleShowAddFriend(false);
  };
  const handleSelection = function (friend) {
    // setSelectedFrd(friend);
    setSelectedFrd((cur) => (cur?.id === friend.id ? null : friend));
    setAddFriend(false);
  };
  console.log(selectedFrd);
  console.log(getAddFrdData);

  const handleSplitBill = function (value) {
    console.log(value);
    setAddFrdData((friends) =>
      friends.map((friend) =>
        friend.id === selectedFrd.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFrd(null);
  };
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={getAddFrdData}
          selectedFrd={selectedFrd}
          onSelect={handleSelection}
        />
        {showAddFriend && <FormAddFriend handleNewFrd={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFrd && (
        <FormSplitBill
          selectedFrd={selectedFrd}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelect, selectedFrd }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFrd={selectedFrd}
          onSelection={onSelect}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFrd }) {
  const isSelected = selectedFrd?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You Owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : " Selected"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ handleNewFrd }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(
    "https://randomuser.me/api/portraits/women/84.jpg"
  );
  const handleSubmit = function (e) {
    e.preventDefault();

    if (!(name && image)) return;

    const newFriend = {
      name: name,
      image: image,
      balance: 0,
      id: +new Date() + name + crypto.randomUUID(),
    };
    // console.log(newFriend);
    handleNewFrd(newFriend);
    setName("");
    setImage("");
  };
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👩🏻‍🤝‍🧑🏻Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌆Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFrd, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const paidByFriend = bill ? bill - paidByUser : "";

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  };
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFrd.name}</h2>

      <label>💵 Bill Value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />

      <label>🧍‍♂️ Your Expence</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(+e.target.value > bill ? paidByUser : +e.target.value)
        }
      />

      <label>👩🏾‍🤝‍👩🏼 {selectedFrd.name} expence</label>
      <input type="text" value={paidByFriend} disabled />

      <label>🤐 Who is Paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="you">You</option>
        <option value="friend">{selectedFrd.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}

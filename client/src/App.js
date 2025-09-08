import { useState, useEffect } from 'react'
import './App.css'
function App() {
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    async function getData() {
      const list = await fetch("http://localhost:3000/contacts");
      const listJson = await list.json();
      return listJson;
    }
    getData().then((data) => {
      setContacts(data);
    })
  },[])
  return (
    <>
      <div>
        <h1>Contact Manager</h1>
      </div>
      <div>
        <ul>
          {contacts.map((contact) => {
            return(
              <>
                <li>{contact.name}- {contact.email}</li>
              </>
            )
          })}
        </ul>
      </div>
    </>
  )
}
export default App
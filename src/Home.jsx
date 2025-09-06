  import { useState, useEffect } from "react";

  import { getUsers } from "./api/users";

  function Home() {
    const [users, setusers] = useState([]);
    useEffect(() => {
      getUsers().then((data => setusers(data)));
    },[])

    return (
      <div>
          <h1>users data</h1>
          <ul>
            {users.map((user)=>{
              return(
              <li key={user.id}>
                <strong>{user.name}</strong>={user.email},<br/>{user.phone}
              </li>
              )
            })}
          </ul>
      </div>
    )
  }

  export default Home

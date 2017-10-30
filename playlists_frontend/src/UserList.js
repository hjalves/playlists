import React from 'react';
import { Table } from 'reactstrap';


const UserList = ({users, handleClick}) => {
  const usersRows = users.map(user => (
    <tr key={user.id} onClick={ev => handleClick(user.id)} className="clickable">
      <th scope="row">{user.id}</th>
      <td>{user.email}</td>
      <td>{user.full_name}</td>
      <td>{user.song_count}</td>
    </tr>
  ));

  return (
    <Table responsive hover>
      <thead className="thead-dark">
      <tr>
        <th>#</th>
        <th>E-mail</th>
        <th>Full name</th>
        <th>Starred songs</th>
      </tr>
      </thead>
      <tbody>
      {usersRows}
      </tbody>
    </Table>
  );
};

export default UserList;

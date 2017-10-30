import React from 'react';
import { Table } from 'reactstrap';


const SongList = ({songs, handleClick}) => {
  const songsRows = songs.map(song => (
    <tr key={song.id} onClick={ev => handleClick(song.id)} className="clickable">
      <th scope="row">{song.id}</th>
      <td>{song.title}</td>
      <td>{song.artist}</td>
      <td>{song.album}</td>
    </tr>
  ));

  return (
    <Table responsive hover>
      <thead className="thead-dark">
      <tr>
        <th>#</th>
        <th>Title</th>
        <th>Artist</th>
        <th>Album</th>
      </tr>
      </thead>
      <tbody>
      {songsRows}
      </tbody>
    </Table>
  );
};

export default SongList;

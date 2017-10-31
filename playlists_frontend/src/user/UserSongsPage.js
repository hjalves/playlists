import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Button, Table, Input } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import Navigation from '../common/Navigation';


const UserSongList = ({songs, userSongIds, handleClick}) => {
  const songsRows = songs.map(song => (
    <tr key={song.id} onClick={ev => handleClick(song.id)}
        className={'clickable' + (userSongIds.has(song.id) ? ' table-active' : '')}>
      {/*<th scope="row">{song.id}</th>*/}
      <th>
      <Input className="ml-0" type="checkbox" name="full_name" id="userName" placeholder=""
             value={song.id} checked={userSongIds.has(song.id)}
             onChange={() => {}}/>
      </th>
      <td>{song.title}</td>
      <td>{song.artist}</td>
      <td>{song.album}</td>
    </tr>
  ));

  return (
    <Table responsive hover>
      <thead className="thead-dark">
      <tr>
        <th> </th>
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


class UserSongsPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userSongIds: new Set(),
      backupUserSongIds: new Set(),
      songs: null,
      changedMade: false,
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.id;

    axios.get(`/users/${userId}/songs/`).then(
      response => {
        const userSongIds = new Set(response.data.map(song => song.id));
        this.setState({ userSongIds, backupUserSongIds: userSongIds });
      }
    );

    axios.get('/songs/', {params: {limit: 1000}}).then(
      response => {
        const songs = response.data.results;
        this.setState({ songs });
      }
    )
  }

  redirectTo = (location) => {
    this.setState({redirectTo: location});
  };

  clickSong = (songId) => {
    const userSongIds = new Set(this.state.userSongIds);
    if (userSongIds.has(songId))
      userSongIds.delete(songId);
    else
      userSongIds.add(songId);
    this.setState({userSongIds, changedMade: true});
  };

  resetChanges = () => {
    const userSongIds = new Set(this.state.backupUserSongIds);
    this.setState({userSongIds, changedMade: false});
  };

  handleSubmit = () => {
    const userId = this.props.match.params.id;
    const ids = Array.from(this.state.userSongIds);
    axios.put(`/users/${userId}/songs/`, {ids}).then(
      response => {
        const userSongIds = new Set(response.data.map(song => song.id));
        this.setState({ userSongIds });
        this.redirectTo(`/users/${userId}`);
      }
    );
  };

  render() {
    const userId = this.props.match.params.id;
    if (this.state.redirectTo) {
      return (
        <Redirect push to={this.state.redirectTo}/>
      )
    }
    if (this.state.loading) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      )
    }

    return (
      <div>
        <Navigation title="Music" description="Choose user favorite songs" >
          <Button color="success" className="mr-2" disabled={!this.state.changedMade}
                  onClick={this.handleSubmit} >
            <FontAwesome name="check"/> Apply</Button>
          <Button color="info" className="mr-2" disabled={!this.state.changedMade}
                  onClick={this.resetChanges}>
            <FontAwesome name="refresh"/> Reset</Button>
          <Button onClick={() => this.redirectTo(`/users/${userId}`)}>
            <FontAwesome name="arrow-left"/> Back to user</Button>
        </Navigation>
        {this.state.songs ?
          <UserSongList songs={this.state.songs}
                        userSongIds={this.state.userSongIds}
                        handleClick={this.clickSong} /> : null}
      </div>
    );
  }
}

export default UserSongsPage;

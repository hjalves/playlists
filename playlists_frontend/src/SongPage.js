import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import Navigation from './Navigation';
import SongList from "./SongList";

class SongPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      songs: [],
      redirectTo: null
    };
  }

  componentDidMount() {
    axios.get('/songs/', {params: {limit: 1000}}).then(
      response => {
        const songs = response.data.results;
        this.setState({ songs, loading: false });
      }
    )
  }

  clickSong = (songId) => {
    console.log(songId);
  };

  newSong = () => {

  };

  redirectTo = (location) => {
    this.setState({redirectTo: location});
  };

  render() {
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
        <Navigation title="Music" description="All songs" >
          <Button onClick={() => this.redirectTo('/songs/new')}>
            <FontAwesome name="plus"/> New song</Button>
        </Navigation>
        <SongList songs={this.state.songs} handleClick={this.clickSong}/>
      </div>
    );
  }
}

export default SongPage;

import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import Navigation from './Navigation';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';


class NewSongPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      redirectTo: null,
      title: '',
      artist: '',
      album: ''
    };
  }

  redirectTo = (location) => {
    this.setState({redirectTo: location});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const song = {
      title: this.state.title,
      artist: this.state.artist,
      album: this.state.album
    };
    axios.post('/songs/', song).then(
      response => {
        console.log(response);
        const songId = response.data.id;
        console.log("Created song with ID: %s", songId);
        this.redirectTo('/songs');
      }
    );
  };

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  };

  render() {
    if (this.state.redirectTo) {
      return (
        <Redirect push to={this.state.redirectTo}/>
      )
    }
    return (
      <div>
        <Navigation title="Music" description="Adding new song" >
          <Button onClick={() => this.redirectTo('/songs')}>
            <FontAwesome name="arrow-left"/> Back to songs</Button>
        </Navigation>

        <Form className="edit-form" onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="songTitle">Title</Label>
            <Input name="title" id="songTitle" placeholder=""
                   value={this.state.title} onChange={this.handleChange}/>
          </FormGroup>
          <FormGroup>
            <Label for="songArtist">Artist</Label>
            <Input name="artist" id="songArtist" placeholder=""
                   value={this.state.artist} onChange={this.handleChange}/>
          </FormGroup>
          <FormGroup>
            <Label for="songAlbum">Album</Label>
            <Input name="album" id="songAlbum" placeholder=""
                   value={this.state.album} onChange={this.handleChange}/>
          </FormGroup>
          <Button color="primary">Add song</Button>
        </Form>
      </div>
    );
  }

}

export default NewSongPage;

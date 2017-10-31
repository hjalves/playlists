import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import Navigation from '../common/Navigation';
import { Button, ButtonGroup, ListGroup, ListGroupItem, Card,
  CardBody, CardFooter, CardHeader, Form, FormGroup, Label, Input
} from 'reactstrap';


class SongDetailsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectTo: null,
      song: null,
      editSong: null,
      editing: false,
    };
  }

  componentDidMount() {
    const songId = this.props.match.params.id;
    axios.get(`/songs/${songId}/`).then(
      response => {
        this.setState({ song: response.data });
      }
    )
  }

  redirectTo = (location) => {
    this.setState({redirectTo: location});
  };

  handleChange = (event) => {
    let editSong = Object.assign({}, this.state.editSong);
    editSong[event.target.name] = event.target.value;
    this.setState({editSong});
  };

  beginEditing = (event) => {
    let editSong = Object.assign({}, this.state.song);
    this.setState({editSong, editing: true});
  };

  cancelEditing = (event) => {
    this.setState({editSong: null, editing: false});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const songId = this.props.match.params.id;
    const song = {
      title: this.state.editSong.title,
      artist: this.state.editSong.artist,
      album: this.state.editSong.album
    };
    axios.put(`/songs/${songId}/`, song).then(
      response => {
        this.setState({song: response.data, editing: false, editSong: null});
      }
    );
  };

  renderShowSong() {
    return (
      <Card>
        <ListGroup className="list-group-flush">
          <ListGroupItem >
            <h5>Title</h5>
            {this.state.song && this.state.song.title}
          </ListGroupItem>
          <ListGroupItem>
            <h5>Artist</h5>
            {this.state.song && this.state.song.artist}
          </ListGroupItem>
          <ListGroupItem>
            <h5>Album</h5>
            {this.state.song && this.state.song.album}
          </ListGroupItem>
        </ListGroup>
        <CardFooter className="border-top-0">
          <Button color="outline-secondary" className="mr-2"
                  onClick={this.beginEditing}>
            <FontAwesome name="pencil"/> Change</Button>
          <Button color="outline-danger">
            <FontAwesome name="trash"/> Delete</Button>
        </CardFooter>
      </Card>
    );
  }

  renderEditSong() {
    return (
      <Form className="edit-form" onSubmit={this.handleSubmit}>
        <FormGroup>
          <Label for="songTitle">Title</Label>
          <Input name="title" id="songTitle" placeholder=""
                 value={this.state.editSong.title}
                 onChange={this.handleChange}/>
        </FormGroup>
        <FormGroup>
          <Label for="songArtist">Artist</Label>
          <Input name="artist" id="songArtist" placeholder=""
                 value={this.state.editSong.artist}
                 onChange={this.handleChange}/>
        </FormGroup>
        <FormGroup>
          <Label for="songAlbum">Album</Label>
          <Input name="album" id="songAlbum" placeholder=""
                 value={this.state.editSong.album}
                 onChange={this.handleChange}/>
        </FormGroup>
        <hr/>
        <Button color="success" className="mr-2" >
          <FontAwesome name="check" /> Apply</Button>
        <Button color="danger" onClick={this.cancelEditing}>
          <FontAwesome name="times"/> Cancel</Button>
      </Form>
    );
  }

  render() {
    if (this.state.redirectTo) {
      return (
        <Redirect push to={this.state.redirectTo}/>
      )
    }
    return (
      <div>
        <Navigation title="Music" description="Song details" >
          <ButtonGroup>
            <Button onClick={() => this.redirectTo('/songs')}>
              <FontAwesome name="arrow-left"/> Back to songs</Button>
          </ButtonGroup>
        </Navigation>
        {this.state.editing ? this.renderEditSong() : this.renderShowSong()}
      </div>
    );
  }

}

export default SongDetailsPage;

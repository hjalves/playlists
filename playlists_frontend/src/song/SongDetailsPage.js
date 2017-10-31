import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import Navigation from '../common/Navigation';
import { Button, ButtonGroup, ListGroup, ListGroupItem,
  Card, CardBody, CardFooter, CardHeader } from 'reactstrap';


class SongDetailsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectTo: null,
      song: null
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
            <Button color="outline-secondary" className="mr-2">
              <FontAwesome name="pencil"/> Change</Button>
            <Button color="outline-danger">
              <FontAwesome name="trash"/> Delete</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

}

export default SongDetailsPage;

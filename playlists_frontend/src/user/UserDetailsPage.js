import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import Navigation from '../common/Navigation';
import { Button, ButtonGroup, ListGroup, ListGroupItem,
  Card, CardBody, CardFooter, CardHeader } from 'reactstrap';


class UserDetailsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectTo: null,
      user: null,
      favoriteSongs: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log("Will receive props: %s", nextProps);
  }

  componentDidMount() {
    const userId = this.props.match.params.id;
    axios.get(`/users/${userId}/`).then(
      response => {
        this.setState({ user: response.data });
        this.getFavoriteSongs();
      }
    )
  }

  getFavoriteSongs() {
    const userId = this.props.match.params.id;
    axios.get(`/users/${userId}/songs/`).then(
      response => {
        this.setState({ favoriteSongs: response.data });
      }
    )
  }

  redirectTo = (location) => {
    this.setState({redirectTo: location});
  };

  renderFavoriteSongs = () => {
    const songs = this.state.favoriteSongs;
    if (songs === null)
      return null;

    const listItems = songs.map(song => {
      let description = `${song.artist} - ${song.title}`;
      if (song.album)
        description += ` (${song.album})`;
      return (
        <ListGroupItem key={song.id}>
          {description}
        </ListGroupItem>
      )
    });

    return (
      <Card className="mt-3">
        <CardHeader className="text-muted">
          {songs.length} favorite songs
        </CardHeader>
        <ListGroup className="list-group-flush">
          {listItems}
        </ListGroup>
        <CardFooter className="border-top-0">
          <Button color="outline-secondary" className="mr-2">
            <FontAwesome name="pencil"/> Change</Button>
        </CardFooter>
      </Card>
    );
  };

  render() {
    if (this.state.redirectTo) {
      return (
        <Redirect push to={this.state.redirectTo}/>
      )
    }
    return (
      <div>
        <Navigation title="Users" description="User details" >

          <ButtonGroup>
            <Button onClick={() => this.redirectTo('/users')}>
              <FontAwesome name="arrow-left"/> Back to users</Button>
          </ButtonGroup>

        </Navigation>
        <Card>
        <ListGroup className="list-group-flush">
          <ListGroupItem >
            <h5>Full name</h5>
            {this.state.user && this.state.user.full_name}
          </ListGroupItem>
          <ListGroupItem>
            <h5>E-mail</h5>
            {this.state.user && this.state.user.email}
          </ListGroupItem>
        </ListGroup>
        <CardFooter className="border-top-0">
          <Button color="outline-secondary" className="mr-2">
            <FontAwesome name="pencil"/> Change</Button>
          <Button color="outline-danger">
            <FontAwesome name="trash"/> Delete</Button>
        </CardFooter>
        </Card>

        {this.renderFavoriteSongs()}

      </div>
    );
  }

}

export default UserDetailsPage;

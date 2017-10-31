import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import Navigation from '../common/Navigation';
import { Button, ButtonGroup, ListGroup, ListGroupItem, Card,
  CardBody, CardFooter, CardHeader, Form, FormGroup, Label, Input,
  Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';


class UserDetailsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectTo: null,
      user: null,
      editUser: null,
      editing: false,
      deleteModal: false,
      favoriteSongs: null
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

  handleChange = (event) => {
    let editUser = Object.assign({}, this.state.editUser);
    editUser[event.target.name] = event.target.value;
    this.setState({editUser});
  };

  beginEditing = (event) => {
    let editUser = Object.assign({}, this.state.user);
    this.setState({editUser, editing: true});
  };

  cancelEditing = (event) => {
    this.setState({editUser: null, editing: false});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const userId = this.props.match.params.id;
    const user = {
      full_name: this.state.editUser.full_name,
      email: this.state.editUser.email,
    };
    axios.put(`/users/${userId}/`, user).then(
      response => {
        this.setState({user: response.data, editing: false, editUser: null});
      }
    );
  };

  toggleDeleteModal = () => {
    this.setState({deleteModal: !this.state.deleteModal});
  };

  handleDelete = () => {
    const userId = this.props.match.params.id;
    axios.delete(`/users/${userId}/`).then(
      response => {
        this.redirectTo('/users');
      }
    );

  };

  renderShowUser() {
    return (
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
          <Button color="outline-secondary" className="mr-2"
                  onClick={this.beginEditing}>
            <FontAwesome name="pencil"/> Change</Button>
          <Button color="outline-danger" onClick={this.toggleDeleteModal}>
            <FontAwesome name="trash"/> Delete</Button>
        </CardFooter>
      </Card>
    );
  }

  renderEditUser() {
    return (
      <Form className="edit-form" onSubmit={this.handleSubmit}>
        <FormGroup>
          <Label for="userName">Full name</Label>
          <Input name="full_name" id="userName" placeholder=""
                 value={this.state.editUser.full_name}
                 onChange={this.handleChange}/>
        </FormGroup>
        <FormGroup>
          <Label for="userEmail">E-mail</Label>
          <Input name="email" id="userEmail" placeholder=""
                 value={this.state.editUser.email}
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

  renderFavoriteSongs() {
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

  renderDeleteModal() {
    return (
      <Modal isOpen={this.state.deleteModal} toggle={this.toggleDeleteModal} >
        <ModalHeader toggle={this.toggleDeleteModal}>Delete User</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this user?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.handleDelete}>
            <FontAwesome name="check" /> Delete</Button>{' '}
          <Button color="secondary" onClick={this.toggleDeleteModal}>
            <FontAwesome name="times" /> Cancel</Button>
        </ModalFooter>
      </Modal>
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
        <Navigation title="Users" description="User details" >
          <ButtonGroup>
            <Button onClick={() => this.redirectTo('/users')}>
              <FontAwesome name="arrow-left"/> Back to users</Button>
          </ButtonGroup>
        </Navigation>
        {this.state.editing ? this.renderEditUser() : this.renderShowUser()}
        {this.renderFavoriteSongs()}
        {this.renderDeleteModal()}
      </div>
    );
  }

}

export default UserDetailsPage;

import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import Navigation from '../common/Navigation';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';


class NewUserPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      redirectTo: null,
      email: '',
      full_name: ''
    };
  }

  redirectTo = (location) => {
    this.setState({redirectTo: location});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const user = {
      email: this.state.email,
      full_name: this.state.full_name
    };
    axios.post('/users/', user).then(
      response => {
        console.log(response);
        const userId = response.data.id;
        console.log("Created user with ID: %s", userId);
        this.redirectTo('/users');
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
        <Navigation title="Users" description="Adding new user" >
          <Button onClick={() => this.redirectTo('/users')}>
            <FontAwesome name="arrow-left"/> Back to users</Button>
        </Navigation>

        <Form className="edit-form" onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="userEmail">E-mail</Label>
            <Input name="email" id="userEmail" placeholder=""
                   value={this.state.email} onChange={this.handleChange}/>
          </FormGroup>
          <FormGroup>
            <Label for="userName">Full name</Label>
            <Input name="full_name" id="userName" placeholder=""
                   value={this.state.full_name} onChange={this.handleChange}/>
          </FormGroup>
          <Button color="primary">Add user</Button>
        </Form>
      </div>
    );
  }

}

export default NewUserPage;

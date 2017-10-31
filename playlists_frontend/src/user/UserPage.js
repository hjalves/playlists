import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import Navigation from '../common/Navigation';
import UserList from "./UserList";

class UserPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      users: [],
      redirectTo: null
    };
  }

  componentDidMount() {
    axios.get('/users/', {params: {limit: 1000}}).then(
      response => {
        const users = response.data.results;
        this.setState({ users, loading: false });
      }
    )
  }

  clickUser = (userId) => {
    this.redirectTo(`/users/${userId}`);
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
        <Navigation title="Users" description="All users" >
          <Button onClick={() => this.redirectTo('/users/new')}>
            <FontAwesome name="plus"/> New user</Button>
        </Navigation>
        <UserList users={this.state.users} handleClick={this.clickUser}/>
      </div>
    );
  }
}

export default UserPage;

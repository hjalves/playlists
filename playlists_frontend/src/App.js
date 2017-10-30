import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Sidebar from './Sidebar';
import SongPage from './SongPage';
import UserPage from './UserPage';
import NewSongPage from './NewSongPage';
import NewUserPage from './NewUserPage';


const Overview = () => (
  <Redirect to="/songs" />
);

class App extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <main role="main" className="col-sm-9 ml-sm-auto col-md-10 pt-3">
            <Switch>
              <Route exact path='/' component={Overview}/>
              <Route exact path='/songs' component={SongPage}/>
              <Route exact path='/songs/new' component={NewSongPage}/>
              <Route exact path='/users' component={UserPage}/>
              <Route exact path='/users/new' component={NewUserPage}/>
            </Switch>
          </main>
        </div>
      </div>
    );
  }
}

export default App;

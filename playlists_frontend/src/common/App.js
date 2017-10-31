import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Sidebar from './Sidebar';
import SongPage from '../song/SongPage';
import NewSongPage from '../song/NewSongPage';
import SongDetailsPage from '../song/SongDetailsPage';
import UserPage from '../user/UserPage';
import NewUserPage from '../user/NewUserPage';
import UserDetailsPage from '../user/UserDetailsPage';
import UserSongsPage from '../user/UserSongsPage';


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
              <Route exact path='/songs/:id' component={SongDetailsPage}/>
              <Route exact path='/users' component={UserPage}/>
              <Route exact path='/users/new' component={NewUserPage}/>
              <Route exact path='/users/:id' component={UserDetailsPage}/>
              <Route exact path='/users/:id/songs' component={UserSongsPage}/>
            </Switch>
          </main>
        </div>
      </div>
    );
  }
}

export default App;

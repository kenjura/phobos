import Article from './Article';
import Login from './Login';
import LoginSuccess from './LoginSuccess';
import React from 'react';
import TopMenu from './TopMenu';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import './App.scss';

export default class App extends React.Component {
	render() {
		return <div id="app">
			<Router>
				<TopMenu />
				<main>
					<Switch>
			          <Route exact path="/login/success" component={LoginSuccess} />
			          <Route exact path="/login" component={Login} />
			          <Route exact path="/" component={Home} />
			          <Route path="/*" render={props => <Article key={props.location.pathname} {...props} />} />
			        </Switch>
			    </main>
			</Router>
		</div>
	}
}



const Home = props => <h1>Home</h1>
const About = props => <h1>About</h1>
const Users = props => <h1>Users</h1>

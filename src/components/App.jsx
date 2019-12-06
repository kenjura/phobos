import Article from './Article';
import Login from './Login';
import LoginSuccess from './LoginSuccess';
import React from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import './App.scss';

export default class App extends React.Component {
	render() {
		return <div id="app">
			<Router>
				<nav id="nav-main">
					<li>
						<Link to="/">Home</Link>
						<Link to="/campaigns/TOS">Example Article</Link>
					</li>
				</nav>
				<main>
					<Switch>
			          <Route exact path="/login/success" component={LoginSuccess} />
			          <Route path="/login" component={Login} />
			          <Route exact path="/" component={Home} />
			          <Route path="/*" component={Article} />
			        </Switch>
			    </main>
			</Router>
		</div>
	}
}



const Home = props => <h1>Home</h1>
const About = props => <h1>About</h1>
const Users = props => <h1>Users</h1>

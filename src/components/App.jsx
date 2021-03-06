import Article from './Article';
import Login from './Login';
import LoginSuccess from './LoginSuccess';
import React from 'react';
import TopMenu from './TopMenu';

import { SiteMenuLoader } from './SiteMenu';
import { StyleLoader } from './Style';
import { BrowserRouter as Router, Switch, Route, Link, withRouter } from "react-router-dom";

import './App.scss';
import 'antd/dist/antd.css';

export default class App extends React.Component {
	render() {
		return <div id="app">
			<Router>
				<Route path="*" render={props => <TopMenu key={props.location.pathname} {...props} />} />
				<Route path="*" component={SiteMenuLoader} />
				<Route path="*" render={props => <StyleLoader key={props.location.pathname} {...props} />} />
				<main>
					<Switch>
			          <Route exact path="/login/success" component={LoginSuccess} />
			          <Route exact path="/login" component={Login} />
			          <Route exact path="/" component={Home} />
			          <Route path="/*" render={props => <Article key={`${props.location.pathname}?${props.location.search}`} foo={`${props.location.pathname}?${props.location.search}`} {...props} />} />
			        </Switch>
			    </main>
			</Router>
		</div>
	}
}



const Home = props => <h1>Home</h1>
const About = props => <h1>About</h1>
const Users = props => <h1>Users</h1>

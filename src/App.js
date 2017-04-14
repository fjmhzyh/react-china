import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink,
  Switch
} from 'react-router-dom';

import './App.css';
import MessageList from './component/test.js'



class Home extends Component{
	constructor(props) {
		super(props);
		this.state={
			pageSize:1
		}
		var me = this;
		this.loadNextPage = function() {
			let style = document.body.currentStyle?e.currentStyle:window.getComputedStyle(document.body,null)
			let bh = parseFloat(style.height);  // body 高度
			let wh = window.innerHeight;        // 可视区域高度
			let st = document.body.scrollTop;   // 滚动距离
			var distance = bh - (wh + st)
			//console.log(distance);
			if( distance < 150){
				window.onscroll = null;
				let p = me.state.pageSize+1
				me.setState({
					pageSize:p
				})
				console.log('set:',me.state.pageSize)
			}
		}
	}
	componentDidMount() {
		window.onscroll = this.loadNextPage
	}
	componentDidUpdate(prevProps, prevState) {
		console.log('DidUpdate')
		window.onscroll = this.loadNextPage
	}
	render() {
		return(
			<div>
				<MessageList pageSize={this.state.pageSize}/>
			</div>
		)
	}
}

const About = () =>(
	<div>
		<h2>About</h2>
	</div>
)

const Topic = ( {match} ) =>(
	<div>
		<h2>Topic</h2>
		<ul>
			<li><Link to={`${match.url}/react`} >react</Link></li>
			<li><Link to={`${match.url}/vue`} >vue</Link></li>
			<li><Link to={`${match.url}/angular`} >angular</Link></li>
		</ul>
		<Route path={`${match.url}/:topicId`} component={Detail} ></Route>
		<Route exact path={match.url} render={() => (
	      <h3>{JSON.stringify({match})}</h3>
	    )}/>
	</div>
)

const Detail = ( {match} ) => (
	<div>
		<p>{match.params.topicId}</p>
		<p>{JSON.stringify({match})}</p>
	</div>
)

const NoMatch = () =>(
	<div>
		<h2>404 Not Found</h2>
	</div>
)


const App = () =>(
	<Router>
		<div>
			<h2 className='fb-title'>hello react</h2>
			<ul className='fb-nav'>
				<li className="fb-nav-list"><NavLink exact to="/">home</NavLink></li>
				<li className="fb-nav-list"><NavLink to="/about">about</NavLink></li>
				<li className="fb-nav-list"><NavLink to="/topic">topic</NavLink></li>
				<li className="fb-nav-list"><NavLink to="/somewhere">somewhere</NavLink></li>
			</ul>
			<hr/>
			<Switch>
				<Route exact path="/" component={Home}></Route>
				<Route path="/about" component={About}></Route>
				<Route path="/topic" component={Topic}></Route>
				<Route component={NoMatch}/>
			</Switch>
		</div>
	</Router>
)

export default App
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink,
  Switch
} from 'react-router-dom';

import './App.css';
import MessageList from './component/test.js'

const url = "http://localhost:3000/";

class Home extends Component{
	constructor(props) {
		super(props);
		this.state={
			pageSize:1
		}
		var me = this;
		this.loadNextPage = function() {
			let style = document.body.currentStyle?document.body.currentStyle:window.getComputedStyle(document.body,null)
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
				<Nav/>
				<MessageList pageSize={this.state.pageSize}/>
			</div>
		)
	}
}

const About = () =>(
	<div>
		<Nav/>
		<h2>About</h2>
	</div>
)

const Topic = ( {match} ) =>(
	<div>
		<Nav/>
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
		<Nav/>
		<p>{match.params.topicId}</p>
		<p>{JSON.stringify({match})}</p>
	</div>
)

const NoMatch = () =>(
	<div>
		<Nav/>
		<h2>404 Not Found</h2>
	</div>
)

const Nav = () =>(
	<div>
		<Top/>
		<ul className='fb-nav'>
			<li className="fb-nav-list"><NavLink exact to="/">home</NavLink></li>
			<li className="fb-nav-list"><NavLink to="/about">about</NavLink></li>
			<li className="fb-nav-list"><NavLink to="/topic">topic</NavLink></li>
			<li className="fb-nav-list"><NavLink to="/somewhere">somewhere</NavLink></li>
		</ul>
		<hr/>
	</div>
)

class Top extends Component{
	constructor(props) {
		super(props);
		this.changeTitle = function(){
			let st = document.body.scrollTop;   // 滚动距离
			if(st>100){
				let mySpan = this.refs.mySpan;
				console.log(top);
				mySpan.innerText = this.props.title;
				window.onscroll = this.changeBack;
			}
		}.bind(this);
		this.changeBack = function() {
			let st = document.body.scrollTop; 
			if(st<100){
				let mySpan = this.refs.mySpan;
				mySpan.innerHTML = '点<a href="https://github.com/fjmhzyh/react-china" class="github"> 这里 </a>,给我的github一个star吧！';
				window.onscroll = this.changeTitle;
			}
		}.bind(this);
	}
	componentDidMount() {
		window.onscroll = this.changeTitle;
	}
	render() {
		return (
			<div className="top-nav">
				<div className="top-nav-left">
					<a href="/"><img src="http://react-china.org/uploads/default/38/c4b96a594bd352e0.png" /></a>
				</div>
				<div className="top-nav-right">
					<h3 className='top-nav-title' ref="mySpan"></h3>
				</div>
			</div>
		)
	}
}

class Page extends Component{
	constructor(props) {
		super(props);
		this.state = {
			data:{
				cooked:'<h2>数据获取中</h2>'
			},
			title:'',
			comments:[]
		}
		let me = this;
		this.fetchPage = function(id){
			fetch(url+'api/data/page/'+id)
			  .then(function(response) {
			    return response.json()
			  }).then(function(json) {
			  	json.post_stream.posts.forEach( (item,i) =>{
			  		let url = item.avatar_template.replace(/\{size\}/g,45);
			  		item.avatar_url = '//reactchina.sxlcdn.com'+url;
			  		item.created_at = item.created_at.split('T')[0];
			  	})
			  	let data = json.post_stream.posts[0];
			  	let comments = json.post_stream.posts.splice(1)
			    me.setState({
			    	data:data,
			    	title:json.title,
			    	comments:comments
			    })
			    console.log('title:',json.title)
			    console.log('page:',id)
			  }).catch(function(ex) {
			    console.log('parsing failed', ex)
			  })
		};
	}
	componentDidMount() {
		console.log('did mount')
		let id = this.props.match.params.id;
		this.fetchPage(id);
	}
	render() {
		var data = this.state.data;
		var comments = this.state.comments;
		return (
			<div>
				<Top title={this.state.title} />
				<div className='page-detail'>
					<h3 className="page-title">{this.state.title}</h3>
					<div className='page-content-box'>
						<div className='page-content-avatar'>
							<img src={data.avatar_url} />
						</div>
						<div className='page-content-right' dangerouslySetInnerHTML={{__html: data.cooked}} />
					</div>
					{
						comments.map( (item,i) =>(
							<div className='page-content-box' key={`${item.id}`}>
								<div className='page-content-avatar'>
									<img src={item.avatar_url} />
								</div>
								<div className='page-content-right'>
									<div className='comment-content'>{item.name}<span className='comment-time'>{item.created_at}</span></div>
									<div dangerouslySetInnerHTML={{__html:`${item.cooked}`}} />
								</div>
							</div>
						))
					}
				</div>
			</div>
		)
	}
}

const App = () =>(
	<Router>
		<div>
			<Switch>
				<Route exact path="/" component={Home}></Route>
				<Route path="/about" component={About}></Route>
				<Route path="/topic" component={Topic}></Route>
				<Route exact path="/t/:name/:id" component={Page}></Route>
				<Route component={NoMatch}/>
			</Switch>
		</div>
	</Router>
)

export default App




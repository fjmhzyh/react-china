import React,{Component} from 'react';
import PropTypes from 'prop-types';
import 'whatwg-fetch';
import moment from 'moment'
moment.lang('zh-cn');

const url = "http://localhost:3000/";


const Message = (props) =>(
	<li className="item-list">
		<ul className="list-ul">
			<li className="list-title" ><a href="">{props.data.title}</a></li>
			<li className="list-other"><a href="">{props.data.category}</a></li>
			<li className="list-other"><a href="">{props.data.views}</a></li>
			<li className="list-other"><a href="">{props.data.created_at}</a></li>
		</ul>
	</li>
)

class MessageList extends Component{
	constructor(props) {
		super(props);
		this.state = {
			data:[],
			pageSize:this.props.pageSize
		}
		var me = this;
		this.fetchData=function(num){
			fetch(url+'api/data/'+num)
			  .then(function(response) {
			    return response.json()
			  }).then(function(json) {
			  	let data = json.topic_list.topics;
			  	data.forEach((item,index) =>{
			  		switch(item.category_id){
			  			case 1:
			  				item.category = '提问';
			  				break;
			  			case 15:
			  				item.category = '分享';
			  				break;
			  			default:
			  				item.category = '其他';
			  				break;
			  		}
			  		let time = moment(item.created_at).format("YYYY-MM-DD");
			  		item.created_at = moment(time, "YYYY-MM-DD").fromNow();
			  	})
			  	let newData = me.state.data.concat(data)
			    me.setState({
			    	data:newData
			    })
			    console.log('fetch:',num)
			  }).catch(function(ex) {
			    console.log('parsing failed', ex)
			  })
		}
	}
	componentDidMount() {
		this.fetchData(this.props.pageSize);
		//window.onscroll = this.loadNextPage
	}
	componentWillReceiveProps(nextProps) {
		this.fetchData(nextProps.pageSize);
	}
	shouldComponentUpdate(nextProps, nextState) {
		//alert("should component up data?")
		return true
	}
	componentDidUpdate(prevProps, prevState) {
		//this.fetchData(this.state.pageSize);
	}
	render() {
		if(this.state.data.length>0){		
			var list = this.state.data.map( (item,i) => (
					<Message key={`list-${i}`} data={item} />
				))		
			return (
				<ul className='msg-list' >
					<Message key='list-header' data={{"title":"主题","category":"分类","views":"浏览","created_at":"时间"}} />
					{list}
				</ul>
			)
		}else{
			return (
				<div><h2>数据加载中</h2></div>
			)
		}
	}
}

export default MessageList;
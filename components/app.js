var ChatBox = React.createClass({
	getInitialState: function () {
		// console.log('\ngetInitialState');
		return {
			chats: null
		};
	},

	componentDidMount: function () {
		var that = this;
		this.socket = io();
		this.socket.on('chats', function (chats) {
			// console.log('\n[socket.on] chats');
			that.setState({ chats: chats });
		});
		// console.log('\n[socket.emit] fetchChats');
		this.socket.emit('fetchChats');
	},

	submitChat: function (chat, callback) {
		// console.log('\n[socket.emit] newChat');
		this.socket.emit('newChat', chat, function (err) {
			if (err) {
				return console.error('New chat error:', err);
			} else {
				callback();
			}
		});
	},

	render: function() {
		// console.log('\nrender chatBox');
		return (
			<div className="chatBox">				
				<ChatForm submitChat={this.submitChat}/>
				<ChatList chats={this.state.chats}/>
			</div>
		);
	}
});

var ChatForm = React.createClass({
	handleSubmit: function (e) {
		// console.log('\nhandleSubmit');
		e.preventDefault();

		var that = this;
		var author = this.refs.author.getDOMNode().value;
		var text = this.refs.text.getDOMNode().value;
		var chat = { author: author, text: text };
		var submitButton = this.refs.submitButton.getDOMNode();

		submitButton.innerHTML = 'Posting .....';
		submitButton.setAttribute('disabled', 'disabled');
		// Submited
		this.props.submitChat(chat, function (err) {
			that.refs.author.getDOMNode().value = '';
			that.refs.text.getDOMNode().value = '';
			submitButton.innerHTML = 'Send';
			submitButton.removeAttribute('disabled');
		});
	},
	render: function () {
		// console.log('\nrender chatForm');
		return (
			<form className="chatForm" onSubmit={this.handleSubmit}>
				<input type="text" name="author" ref="author" placeholder="Name" required /><br/>
				<textarea name="text" ref="text" placeholder="Chat" required></textarea><br/>
				<button type="submit" ref="submitButton">Send</button>
			</form>
		);
	}
});

var ChatList = React.createClass({
	render: function () {
		// console.log('\nrender chatList');
		var Chats = (<div>Loading...</div>);
		if (this.props.chats) {
			Chats = this.props.chats.map(function (chat) {
				return (<Chat chat={chat} />);
			});
		}
		return (
			<div className="chatList">
				{Chats}
			</div>
		);
	}
});

var Chat = React.createClass({
	render: function () {
		// console.log('\nrender chat');
		return (
			<div className="chat">
				<span className="author">{this.props.chat.author}</span> :<br/>
				<div className="body">{this.props.chat.text}</div>
			</div>
		);
	}
});

React.render(
	<ChatBox/>,
	document.getElementById('content')
);

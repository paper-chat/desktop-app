// Legacy code
// TODO: full refactor

import React from 'react';
import Message from './Message';

class MessageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: '', messages: [], isFetching: true, selectedFile: null };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // this.handleChange = this.handleChange.bind(this);
  // this.handleSubmit = this.handleSubmit.bind(this);
  tick() {
    fetch(process.env.REACT_APP_API_URL + "/v1/chat/" + this.props.id + '/get?count=45')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const localMessages = [];
        data.forEach((element) => {
          localMessages.push(
            <Message
              text={element.content}
              ip={element.ip}
              time={element.time}
            />
          );
        });
        this.setState({ messages: localMessages, isFetching: false });
      });
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.message.length > 150) {
      alert('Message too large');
      return;
    }
    if (this.state.message.length === 0 && this.state.selectedFile === null) {
      return;
    }
    const url = process.env.REACT_APP_API_URL + "/v1/chat/" + this.props.id + '/send';

    let formData = new FormData();
    formData.append("message", this.state.message);
    this.setState({ message: '' });
    fetch(url,
    {
      body: formData,
      method: "post"
    })
  }

  render() {
    const { isFetching } = this.state;
    if (isFetching) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <div
          style={{ overflow: 'auto', height: '80vh' }}
          className="message-box"
        >
          {this.state.messages}
        </div>
        <div className="sendMessage">
            <form onSubmit={this.handleSubmit} >
                <label>
                    Сообщение
                    <input
                    id="message"
                    onChange={this.handleChange}
                    value={this.state.message}
                    />
                </label>
                <input type="submit" value="Отправить" />
            </form>
        </div>
      </div>
    );
  }
}

export default MessageBox;

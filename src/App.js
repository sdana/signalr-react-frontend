import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr"
import MessageHandler from "./MessageHandler"

class App extends Component {

  state = {
    message: [],
    clicks: 0,
    switcher: true
  }

componentDidMount = () => {
  // const hubConnection = new HubConnection("https://localhost:5001/Hubs/ChatHub")
  const hubConnection = new HubConnectionBuilder()
    .withUrl("http://10.0.0.134:5001/Hubs/ChatHub")
    .configureLogging(LogLevel.Information)
    .build();
  this.setState({ hubConnection }, () => {
    this.state.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

    this.state.hubConnection.on("youClicked", n => {
        let clickNum = this.state.clicks + 1
        this.setState({clicks: clickNum})
        console.log("You clicked on the button")
    })

    this.state.hubConnection.on("downloadMessage", n =>
    {
      console.log("Working")
      console.log(n)
      let addMessage = this.state.message
      addMessage.push(n)
      this.setState({message: addMessage})
    })

  });



}

connectionEstablished = () => {
  if (this.state.hubConnection)
  {
    this.state.hubConnection.on("works", b => {
      console.log("This shit works yo!")
    })

    // this.state.hubConnection.on("youClicked", n => {
    //   console.log("You clicked on the button")
    // })
  }
}

testConnection = () => {
  if (this.state.hubConnection){
    this.state.hubConnection.invoke("NewClick").catch(err => console.error(err.toString()));
    // this.state.hubConnection.on("youClicked", b => {
    //   console.log("you clicked the button")
    // })
  }

}

sendMessage = (e) => {
  e.preventDefault()
  if (this.state.hubConnection){
    console.log("Sending message")
    this.state.hubConnection.invoke("newMessage", this.state.messageField).catch(err => console.error(err.toString()))
    this.setState({
      switcher: !this.state.switcher
    })
  }

}

  handleFieldChange = evt => {
    const stateToChange = {}
    stateToChange[evt.target.id] = evt.target.value
    this.setState(stateToChange)
  }


render() {
  // this.state.hub.on("OnConnectedAsync", b => {
  //     console.log("connected!", b)
  // })

    return (
      <div id="main">
        {/* <button onClick={this.testConnection}>Click Me</button>
        <h2>Clicks: {this.state.clicks}</h2> */}
        <h1>Awesome Chat</h1>

        <input type="text" placeholder="username" onChange={this.handleFieldChange}></input><button>Submit</button>
        <div id="message-box">
        <ul>
        {/* <MessageHandler message={this.state.message}/> */}
        {this.state.message.map(message => {return <li>{message}</li>})}
        </ul>
        </div>
        <form onSubmit={(e) => {this.setState({messageField: ""}); this.sendMessage(e)}}><input id="messageField" autoComplete="off" type="text" placeholder="message" value={this.state.messageField} onInput={e => this.handleFieldChange(e)}></input><button type="submit">Send</button></form>
      </div>
    );
  }
}

export default App;

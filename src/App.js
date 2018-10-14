import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr"
import MessageHandler from "./MessageHandler"

class App extends Component {

  state = {
    message: ["none yet"],
    clicks: 0,
    switcher: true
  }

componentDidMount = () => {
  // const hubConnection = new HubConnection("https://localhost:5001/Hubs/ChatHub")
  const hubConnection = new HubConnectionBuilder()
    .withUrl("http://10.1.10.145:5001/Hubs/ChatHub")
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
      this.state.message.push(n)
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

sendMessage = () => {
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
      <div>
        <button onClick={this.testConnection}>Click Me</button>
        <h2>Clicks: {this.state.clicks}</h2>

        <div id="message-box">
        <ul>
        {/* <MessageHandler message={this.state.message}/> */}
        {this.state.message.map(message => {return <li>{message}</li>})}
        </ul>
        </div>
        <input id="messageField" type="text" placeholder="message" onInput={e => this.handleFieldChange(e)}></input><button onClick={this.sendMessage}>Send</button>
      </div>
    );
  }
}

export default App;

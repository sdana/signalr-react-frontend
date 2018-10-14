import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr"

class App extends Component {
  
  state = {
    message: "",
    clicks: 0
  }

componentDidMount = () => {
  // const hubConnection = new HubConnection("https://localhost:5001/Hubs/ChatHub")
  const hubConnection = new HubConnectionBuilder()
    .withUrl("http://192.168.1.104:80/Hubs/ChatHub")
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


// connection.invoke() this is how you 
render() {
  // this.state.hub.on("OnConnectedAsync", b => {
  //     console.log("connected!", b)
  // })
  console.log(this.state.hubConnection)
    return (
      <div>
        <button onClick={this.testConnection}>Click Me</button>
        <h2>Clicks: {this.state.clicks}</h2>
      </div>
    );
  }
}

export default App;

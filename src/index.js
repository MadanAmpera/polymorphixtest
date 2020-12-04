import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import React from 'react';
import ReactDOM from 'react-dom';
import DataGrid, { Column, Selection, Summary, GroupItem, SortByGroupSummaryInfo } from 'devextreme-react/data-grid';
import service from './data.js';
import './index.css';

class GridData extends React.Component {
  constructor(props) {
    super(props);
    this.orders = service.getOrders();
  }
	render() {
  	//this.orders = this.props;
  	return (
    	<React.Fragment>
        <DataGrid
          id="gridContainer"
          dataSource={this.orders}
          keyExpr="ID"
          showBorders={true}>
          <Selection mode="single" />
          <Column dataField="OrderNumber" width={130} caption="Invoice Number" />
          <Column dataField="OrderDate" width={160} dataType="date" />
          <Column dataField="Employee" groupIndex={0} />
          <Column dataField="CustomerStoreCity" caption="City" />
          <Column dataField="CustomerStoreState" caption="State" />
          <Column dataField="SaleAmount" alignment="right" format="currency" />
          <Column dataField="TotalAmount" alignment="right" format="currency" />

          <Summary>
            <GroupItem
              column="OrderNumber"
              summaryType="count"
              displayFormat="{0} orders" />
            <GroupItem
              column="SaleAmount"
              summaryType="max"
              valueFormat="currency"
              showInGroupFooter={false}
              alignByColumn={true} />
            <GroupItem
              column="TotalAmount"
              summaryType="max"
              valueFormat="currency"
              showInGroupFooter={false}
              alignByColumn={true} />
            <GroupItem
              column="TotalAmount"
              summaryType="sum"
              valueFormat="currency"
              displayFormat="Total: {0}"
              showInGroupFooter={true} />
          </Summary>
          <SortByGroupSummaryInfo summaryItem="count" />
        </DataGrid>
      </React.Fragment>
    );
  }
}

class Form extends React.Component {
  state = { userName: '', 
            password: '',  
            usrReg: '', 
            pwdReg: '',
            email: '',
            fullName: '',
            visibility: "none"
          };
	handleSubmit = async (event) => {
    event.preventDefault();
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(
      {"password":this.state.password,
      "type":"normal",
      "username":this.state.userName}
      );

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://20.188.230.200:8000/api/v1/auth", requestOptions)
      .then(response => {
        if(response.status === 200){
          alert("Login successful!!");
          this.setState({ visibility: "block" });
        }
        else{
          alert("Login failed :(");
          this.setState({ visibility: "none" });
        }
      })
      .then(result => console.log(result))
      .catch(error => console.log(error));
    
    //this.props.onSubmit(resp.data);
    this.setState({ userName: '', password: '' });
  };

  handleRegister = async (event) => {
    event.preventDefault();
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(
      {"accepted_terms":"true",
      "email":this.state.email,
      "full_name":this.state.fullName,
      "password":this.state.pwdReg,
      "type":"public",
      "username":this.state.usrReg}
    );

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

  fetch("http://20.188.230.200:8000/api/v1/auth/register", requestOptions)
    .then(response => {
      if(response.status === 201){
        alert("Registration successful!! ---- Login now");
      }
      else{
        alert("Registration failed :(");
      }
    })
    .then(result => console.log(result))
    .catch(error => console.log(error));

    this.setState({ pwdReg: '', usrReg: '', fullName: '', email: '' });
    
  };

	render() {
  	return (
      <div>
      <p>Login to see your data</p>
        <form onSubmit={this.handleSubmit}>
          <input 
            type="text" 
            value={this.state.userName}
            onChange={event => this.setState({ userName: event.target.value })}
            placeholder="username" 
            required 
          />
          <input 
            type="text" 
            value={this.state.password}
            onChange={event => this.setState({ password: event.target.value })}
            placeholder="password" 
            required 
          />
          <button>Login</button>
        </form>
        
        <p>New user - Register here</p>

        <form onSubmit={this.handleRegister}>
        <input 
            type="text" 
            value={this.state.fullName}
            onChange={event => this.setState({ fullName: event.target.value })}
            placeholder="full name" 
            required 
          />
          <input 
            type="text" 
            value={this.state.email}
            onChange={event => this.setState({ email: event.target.value })}
            placeholder="email id" 
            required 
          />
          <input 
            type="text" 
            value={this.state.usrReg}
            onChange={event => this.setState({ usrReg: event.target.value })}
            placeholder="username" 
            required 
          />
          <input 
            type="text" 
            value={this.state.pwdReg}
            onChange={event => this.setState({ pwdReg: event.target.value })}
            placeholder="password" 
            required 
          />
          <button>Register</button>
        </form>
        <p>Your data</p>
        <div style={{display: this.state.visibility}}>
          <GridData></GridData>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
	render() {
  	return (
    	<div>
    	  <div className="header">{this.props.title}</div>
        <Form />
    	</div>
    );
  }	
}

//onSubmit={this.addNewProfile}
//profiles={this.state.profiles}

let mountNode = document.getElementById('root')

ReactDOM.render(
	<App title="Taiga Login" />,
  mountNode,
);
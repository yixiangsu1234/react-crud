import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Table, Input, Modal, message,Popconfirm,  Divider,Button} from 'antd';
const Search = Input.Search;

class Fetch extends Component{
  constructor(props) {
    super(props)
    this.state = {
      allUsers: [],
      visible: false,
      user:"",
    }
    this.query = this.query.bind(this)
    this.delUser = this.delUser.bind(this)
    this.showModal = this.showModal.bind(this)
    this.handleName = this.handleName.bind(this)
    this.handleAge = this.handleAge.bind(this)
    this.handleAddress = this.handleAddress.bind(this)
    this.addUser = this.addUser.bind(this)
  }

  handleName (e) {
    this.setState({
        username: e.target.value
    })
  }

  handleAge(e) {
    this.setState({
        userage: e.target.value
    })
  }

  handleAddress(e) {
    this.setState({
        useraddress: e.target.value
    })
  }
  //删除用户提示
success = () => {
    message.success('删除用户成功');
    this.queryAll() 
  };
  //增加用户提示
  addsuccess = () => {
    message.success('增加用户成功');
    this.queryAll() 
    this.refs.nameinput.state.value = "";
    this.refs.ageinput.state.value = "";
    this.refs.addinput.state.value = ""
  };

//弹窗
showModal = (record) => {
  this.setState({
    visible: true,
    userid:record.id,
    username:record.name,
    userage:record.age,
    useraddress:record.address
  });
}

handleOk = (e) => {
  console.log(e);
  this.setState({
    visible: false,
  });
}

handleCancel = (e) => {
  //console.log(e);
  this.setState({
    visible: false,
  });
}

//获取全部数据
  queryAll() {
    fetch( '/api/user/allUser',{
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    })
    .then((res) => {return res.json()})
    .then(data => {
    //  console.log(data)
      this.setState({allUsers: data})
    })
    .catch(e => console.log('错误:', e))
  }
//根据条件查询数据
  query(value) {
      //console.log(value)
      fetch( '/api/user/queryUser?params='+ value,{
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
      },
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      })
      .then((response) => {
        return response.json();
        })
      .then(data => {
       // console.log(data)
        this.setState({allUsers: data})
      })
      .catch(e => console.log('错误:', e))
      }
//删除数据
  delUser(key){
   // console.log(key)
    fetch( '/api/user/deleteUser?id='+ key,{
        headers: {'Content-Type': 'application/json'},
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      })
      .then((response) => {
        return response.json();
        })
      .then(data => {
        this.success()
      })
      .catch(e => console.log('错误:', e))
  }
//增加数据
  addUser(){
    var  username = this.refs.nameinput.state.value
    var  ageValue = this.refs.ageinput.state.value
    var addValue = this.refs.addinput.state.value
    console.log(username,ageValue,addValue)
    fetch( '/api/user/addUser',{
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ 
        username: username, 
        age:ageValue,
        address: addValue
      }), 
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      })
      .then((response) => {
        return response.json();
       })
        .then(data => {
          this.addsuccess()
        })
        .catch(e => console.log('错误:', e))
  }
//修改数据

modUser(){
  var userid = this.state.userid
  var  username = this.state.username
  var  ageValue = this.state.userage
  var addValue = this.state.useraddress
  //console.log(username,ageValue,addValue)
  fetch( '/api/user/patchUser',{
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    body: JSON.stringify({ 
      id:userid,
      username: username, 
      age:ageValue,
      address: addValue
    }), 
    method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
    })
    .then((response) => {
      return response.json();
     })
      .then(data => {
       this.setState({
        visible: false,
      });
      this.queryAll() 
      })
      .catch(e => console.log('错误:', e))
}


test(){
  console.log("点击提交按钮了")
  console.log(this.refs.modname.state.value); 
  console.log(this.refs.modage.state.value); 
  console.log(this.refs.modadd.state.value); 
}

  componentDidMount () {
    this.queryAll() 
  }

  render() {
    const columns = [ {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
      {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
     {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <span  onClick={() => this.showModal(record)}>
            <span className="oper">修改</span>
          </span>
          
          <Divider type="vertical" />
          
          <Popconfirm title="Sure to delete?" onConfirm={() => this.delUser(record.id)}>
              <span className="oper">Delete</span>
            </Popconfirm>
        </span>
      ),
    }];
    

    const data = this.state.allUsers
    return (
      <div className="fetchBox">
    
        <Search style={{width:500+"px"}}
      placeholder="input search text"
      onSearch={value => this.query(value)}
      enterButton
    />
        <Table  className="tableBox" columns={columns} dataSource={data} bordered={true} rowKey={record => record.id} />

        <div className="addUser">
        <Input placeholder="姓名"  ref="nameinput"/>
        <Input placeholder="年龄"  ref="ageinput"/>
        <Input placeholder="地址"  ref="addinput"/>
        <Button   onClick={this.addUser.bind(this)}>Submit</Button> 
        </div>

        {/* 弹窗 */}

        <Modal
          title="修改用户信息"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
        <Input style={{marginBottom:20+"px"}} placeholder="姓名" value={this.state.username}  ref="modname" onChange={this.handleName}/>
        <Input style={{marginBottom:20+"px"}} placeholder="年龄" value={this.state.userage} ref="modage" onChange={this.handleAge}/>
        <Input  style={{marginBottom:20+"px"}} placeholder="地址"  value={this.state.useraddress} ref="modadd" onChange={this.handleAddress}/>
        <Button  style={{margin:0+"px"}}  onClick={this.modUser.bind(this)}>提交</Button> 
        </Modal>
      </div>
      
  )}
}





function App() {
  
  return (
    <div className="App">
      <header className="App-header">
      <Fetch/>
      </header>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {
  const [token, settoken] = useState([])
  const [groups, setgroups] = useState([])
  const [departmentvalue, setdepartmentvalue] = useState("0")
  const [departmentname, setdepartmentname] = useState("")
  const [departmentid, setdepartmentid] = useState("")
  const [jobtitlename, setjobtitlename] = useState("")
  const [jobtitles, setjobtitles] = useState([])
  const [close, setclose] = useState(false)
  const [jobtitleid, setjobtitleid] = useState('')

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
    const urlencoded = new URLSearchParams();
    urlencoded.append("username", "admin");
    urlencoded.append("password", "S0lut!0n");
    urlencoded.append("grant_type", "password");
    urlencoded.append("client_id", "react");
    urlencoded.append("client_secret", "mBbGvNKzOpPn13BuqKxcZicv8nu4eKq5");
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    };
    
    fetch("https://idp.authweiler.com/realms/master/protocol/openid-connect/token", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        settoken(result.access_token)
      })
      .catch((error) => console.error(error));
  }, [])

  useEffect(() => {
    if(token){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch("https://idp.authweiler.com/admin/realms/izuzu/groups", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setgroups(result)
      })
      .catch((error) => console.error(error));
    }
  }, [token])
  

  const GetAllGroups =()=>{
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch("https://idp.authweiler.com/admin/realms/izuzu/groups", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setgroups(result)
      })
      .catch((error) => console.error(error));
  }
  const GetAllJobtitle =()=>{
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch(`https://idp.authweiler.com/admin/realms/izuzu/groups/${departmentvalue}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const jobtitlevalue = [result].map(jobtitle => jobtitle.subGroups).flat();
        setjobtitles(jobtitlevalue)
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    if(token&&departmentvalue){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch(`https://idp.authweiler.com/admin/realms/izuzu/groups/${departmentvalue}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const jobtitlevalue = [result].map(jobtitle => jobtitle.subGroups).flat();
        setjobtitles(jobtitlevalue);
      })
      .catch((error) => console.error(error));
    }
  }, [token,departmentvalue])
  
  


  const handleAdddepartment = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    const raw = JSON.stringify({
      "name": departmentname,
      "path": `/${departmentname}`,
      "attributes": {
        "country": [
          "Thailand"
        ]
      },
      "realmRoles": [],
      "clientRoles": {},
      "subGroups": [
      ]
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    fetch("https://idp.authweiler.com/admin/realms/izuzu/groups", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setclose(false);
        GetAllGroups()
      })
      .catch((error) => console.error(error));
  };

  const handleAddjobtitle =()=>{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    const raw = JSON.stringify({
      "name": jobtitlename,
      "path": `/${jobtitlename}`,
      "attributes": {
        "country": [
          "Thailand"
        ]
      },
      "realmRoles": [],
      "clientRoles": {},
      "subGroups": []
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    fetch(`https://idp.authweiler.com/admin/realms/izuzu/groups/${departmentid}/children`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setclose(false);
        GetAllJobtitle()
      })
      .catch((error) => console.error(error));
  }

  
  const handleDepartment = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "add department") {
      setdepartmentvalue(selectedValue);
      setclose(true);
    }
    else {

  
      // ตั้งค่า departmentvalue เป็น ID ของแผนกที่ถูกเลือก
      setdepartmentvalue(selectedValue);
      setdepartmentid(selectedValue);
    }
  };

  const handleJobtitle = (e) => {
    const selectedValue = e.target.value;
    if(selectedValue === "add jobtitle"){
      // setdepartmentvalue(selectedValue);
      setclose(true);
    }
    else {  
      // ตั้งค่า departmentvalue เป็น ID ของแผนกที่ถูกเลือก
      setjobtitleid(selectedValue);
    }
  };
  return (
    <div>
      <p>Department&nbsp; 
        <select onChange={handleDepartment} value={departmentid} style={{width:"auto"}}>
          <option value={0}>Select Department:</option>
          {groups.map((department, index) => (
            <option key={department.id} value={department.id}>{department.name}</option>
          ))}
          <option style={{color:"red"}} value={"add department"}><button >Add Department +</button></option>
        </select>
      </p>
      {departmentvalue!=="0"&&departmentvalue!=="add department"?
      <p>Jobtitle&nbsp; 
        <select onChange={handleJobtitle} value={jobtitleid} style={{width:"auto"}}>
          <option value={0}>Select Jobtitle:</option>
          {jobtitles?.map((jobtitle, index) => (
            <option key={jobtitle?.id} value={jobtitle?.id}>{jobtitle?.name}</option>
          ))}
          <option style={{color:"red"}} value={"add jobtitle"}><button >Add Jobtitle +</button></option>
        </select>
      </p>
      :null}
    

      <Dialog
        open={close}
        TransitionComponent={Transition}
        keepMounted
        onClose={close}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{display:"flex",justifyContent:"center"}}>{departmentvalue==="add department"?"Add Department":"Add Jobtitle"}</DialogTitle>
        <DialogContent>
          <p>{departmentvalue==="add department"?"Department":"Jobtitle"} <input onChange={(e)=>{departmentvalue==="add department"?setdepartmentname(e.target.value):setjobtitlename(e.target.value)}}/></p>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{setclose(false);}}>Cancel</Button>
          <Button onClick={departmentvalue==="add department"? handleAdddepartment:handleAddjobtitle}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default App
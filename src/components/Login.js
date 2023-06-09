import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });
        const json = await response.json();
        // console.log(json);
        if (json.success) {
            //redirect
            // Save the auth token and redirect
            localStorage.setItem('token', json.authToken);
            navigate("/");
            props.showAlert("Login Successfully!!!", "success ")
        }
        else {
            props.showAlert("Invalid credentials", "error ")
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div>
            <form onSubmit={handleSubmit} style={{ color: props.mode === 'dark' ? 'white' : '#230554' }}>
                <h1>Login to use iNotebook</h1>
                <div className="mb-3" >
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="exampleInputEmail1" name="email" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text" style={{ color: props.mode === 'dark' ? 'white' : '#230554' }}>We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" value={credentials.password} onChange={onChange} id="exampleInputPassword1" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login

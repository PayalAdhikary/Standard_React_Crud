import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import './Login.scss';
import CrudServices from '../Services/CrudServices';

const service = new CrudServices();

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect to dashboard if already logged in (only run once on component mount)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const dept = localStorage.getItem('dept');

    if (token && dept) {
      navigate('/dashboard');
    }
  }, [navigate]); // Empty dependency array ensures this runs only once

  const handleClickShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'login_id') setLoginId(value);
    if (name === 'password') setPassword(value);
  };

  const handleClick = () => {
    if (loginId === '' || password === '') {
      setError('Please fill all the fields');
      return;
    }

    const data = {
      login_id: loginId,
      password: password
    };

    service.LoginRecord(data)
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token); // Store token
          localStorage.setItem('dept', response.data.dept); // Store dept
          localStorage.setItem('user_id', response.data.userId); // Store dept
          navigate('/dashboard'); // Redirect to dashboard
        } else {
          setError('Login failed. Please check your credentials.');
        }
      })
      .catch(() => {
        setError('Login failed. Please try again.');
      });
  };

  return (
    <div className="Login">
      <Paper elevation={3} className="Paper">
        <div className="Input">
          <TextField
            id="standard-basic"
            label="Enter Email"
            variant="standard"
            size="small"
            fullWidth
            name="login_id"
            value={loginId}
            onChange={handleChange}
          />
        </div>

        <div className="Input">
          <FormControl sx={{ width: '100%' }} variant="standard">
            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
            <Input
              fullWidth
              name="password"
              value={password}
              onChange={handleChange}
              id="standard-adornment-password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>

        <div className="Input">
          <Button variant="contained" onClick={handleClick}>Login</Button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}
      </Paper>
    </div>
  );
};

export default Login;

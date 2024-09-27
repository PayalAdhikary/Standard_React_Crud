import React, { Component } from 'react';
import { TextField, Grid, CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';
import CrudServices from '../Services/CrudServices';
import './HomePage.scss';

const service = new CrudServices();

export default class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginId: '',
      loading: false,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'login_id') this.setState({ loginId: value });
  };

  handleClick = () => {
    const { loginId } = this.state;
    if (loginId === '') {
      Swal.fire('Error', 'Please enter your email', 'error');
      return;
    }

    this.setState({ loading: true });

    const data = {
      login_id: loginId,
    };

    service.ForgetPassword(data)
      .then((response) => {
        this.setState({ loading: false });
        Swal.fire('Success', 'New password sent to your email', 'success');
      })
      .catch(() => {
        this.setState({ loading: false });
        Swal.fire('Error', 'Something went wrong', 'error');
      });
  };

  render() {
    const { loginId, loading } = this.state;

    return (
      <div className="MainContainer">
        <div className="SubContainer">
          <Grid container spacing={2} justifyContent="center" alignItems="center" direction="column">
            <Grid item xs={12}>
              <h2>Reset Your Password</h2>
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="standard-basic"
                label="Enter your email"
                variant="outlined"
                name="login_id"
                value={loginId}
                onChange={this.handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <div className="Button">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleClick}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

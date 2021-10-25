import "materialize-css/dist/css/materialize.min.css";
import React, { Component } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@mui/material/Paper";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  float: {
    float: "none",
    width: "100%",
    paddingLeft: "1%",
    paddingRight: "1%",
    paddingTop: "1%",
    marginBottom: "1%",
    paddingBottom: "1%",
    [theme.breakpoints.up("md")]: {
      float: "left",
      width: "58%",
      paddingLeft: "3%",
      paddingRight: "3%",
      paddingTop: "1%",
      marginBottom: "0%",
      paddingBottom: "1%",
      marginRight: "1%",
      marginLeft: "1%",
      marginTop: "1%",
    },
  },
  left: {
    float: "none",
    width: "100%",
    paddingLeft: "1%",
    paddingRight: "1%",
    paddingTop: "1%",
    marginBottom: "1%",
    paddingBottom: "1%",
    [theme.breakpoints.up("md")]: {
      float: "left",
      width: "39%",
      marginBottom: "0%",
      marginRight: "1%",
      paddingLeft: "3%",
      paddingRight: "3%",
      paddingTop: "1%",
      paddingBottom: "1%",
      marginTop: "1%",
    },
  },
  box: {
    marginRight: "2%",
    width: "30%",
  },
  bottom: {
    padding: "1%",
  },
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class RetailerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      list2: [],
      list0: [],
      id: "",
      name: "",
      job: "",
      open: false,
      warning: false,
      edit: false,
    };
  }
  componentDidMount() {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios
      .get("https://reqres.in/api/users?page=2", config)
      .then((res) => {
        console.log(res.data.data);
        this.setState({
          list: res.data.data.map((item, index) => {
            return { index: index, ...item };
          }),
        });
      })
      .catch((err) => console.log(err));
  }

  deleteHandler = (index) => {
    console.log(index);
    let id = this.state.list2[index].id;
    console.log(id);
    axios
      .delete(`https://reqres.in/api/users/${id}`)
      .catch((err) => console.log(err))
      .then(() => {
        this.setState({
          list0: this.state.list0.filter((data) => {
            return data.id !== id;
          }),
        });
        this.setState({ list2: this.state.list0 });
        this.setState({ warning: true });
      })
      .catch((err) => console.log(err));
  };

  submitHandler = (e) => {
    e.preventDefault();
    axios
      .post("https://reqres.in/api/users", {
        id: this.state.id,
        name: this.state.name,
        job: this.state.job,
      })
      .catch((error) => {
        console.log(error);
      })
      .then((res) => {
        console.log(res);
        let put = this.state.list2.find((data) => {
          return (
            (data.id === res.data.id && data.name) === res.data.name &&
            data.job === res.data.job
          );
        });
        let flag = this.state.list0.find((data) => {
          return data.id === res.data.id;
        });
        if (flag) {
          this.setState({
            list0: this.state.list0.filter((data) => {
              return data.id !== res.data.id;
            }),
          });
        }
        this.state.list0.push(res.data);
        console.log(this.state.list0);
        this.setState({
          list2: this.state.list0.map((item, index) => {
            return { index: index, ...item };
          }),
        });
        console.log(this.state.list2);
        // window.alert(`User Added Sucessfully!`);

        if (put) {
          window.alert(
            `error! The user having id ${res.data.id} is already present`
          );
        } else {
          this.setState({ open: true });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editHandler = (index) => {
    console.log(index);
    let id = this.state.list2[index].id;
    console.log(id);
    let user = this.state.list2.find((res) => {
      return res.id === id;
    });
    this.setState({ edit: true });
    this.setState({ id: user.id });
    this.setState({ name: user.name });
    this.setState({ job: user.job });
  };

  render = () => {
    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      this.setState({ open: false });
    };

    const handleWarning = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      this.setState({ warning: false });
    };

    console.log("render called for users");
    console.log(this.state.list);
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.float} elevation={3}>
          <div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>JOB</th>
                  <th>CREATED AT</th>
                  <th>DELETE</th>
                  <th>EDIT</th>
                </tr>
              </thead>
              <tbody>
                {this.state.list2.map((res, index) => {
                  return (
                    <tr key={res.id}>
                      <td>{res.id}</td>
                      <td>{res.name}</td>
                      <td>{res.job}</td>
                      <td>{res.createdAt}</td>
                      <td>
                        {
                          <Stack spacing={2} sx={{ width: "55%" }}>
                            <Button
                              variant="contained"
                              onClick={() => this.deleteHandler(index)}
                            >
                              delete
                            </Button>
                            <Snackbar
                              open={this.state.warning}
                              autoHideDuration={4000}
                              onClose={handleWarning}
                            >
                              <Alert
                                onClose={handleWarning}
                                severity="warning"
                                sx={{ width: "100%" }}
                              >
                                A user is deleted successfully!
                              </Alert>
                            </Snackbar>
                          </Stack>
                        }
                      </td>
                      <td>
                        {
                          <Button
                            variant="contained"
                            className={classes.box}
                            onClick={() => this.editHandler(index)}
                          >
                            EDIT
                          </Button>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Paper>
        <div>
          <Paper elevation={3} className={classes.left}>
            <div>
              <h5>CREATE USERS</h5>
              <form>
                <div>
                  <label>id : </label>
                  <input
                    type="text"
                    onChange={(e) => this.setState({ id: e.target.value })}
                    value={this.state.id}
                  />
                </div>
                <div>
                  <label>name : </label>
                  <input
                    type="text"
                    onChange={(e) => this.setState({ name: e.target.value })}
                    value={this.state.name}
                  />
                </div>
                <div>
                  <label>job : </label>
                  <input
                    type="text"
                    onChange={(e) => this.setState({ job: e.target.value })}
                    value={this.state.job}
                  />
                </div>

                <Stack spacing={2} sx={{ width: "25%" }}>
                  <Button variant="contained" onClick={this.submitHandler}>
                    submit
                  </Button>
                  <Snackbar
                    open={this.state.open}
                    autoHideDuration={4000}
                    onClose={handleClose}
                  >
                    <Alert
                      onClose={handleClose}
                      severity="success"
                      sx={{ width: "100%" }}
                    >
                      This is a success message!
                    </Alert>
                  </Snackbar>
                </Stack>
              </form>
            </div>
          </Paper>
        </div>
        <Paper elevation={3} className={classes.bottom}>
          <div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>FIRST NAME</th>
                  <th>LAST NAME</th>
                  <th>EMAIL</th>
                </tr>
              </thead>
              <tbody>
                {this.state.list.map((res, index) => {
                  return (
                    <tr key={res.id}>
                      <td>{res.id}</td>
                      <td>{res.first_name}</td>
                      <td>{res.last_name}</td>
                      <td>{res.email}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Paper>
      </div>
    );
  };
}

export default withStyles(styles, { withTheme: true })(RetailerList);

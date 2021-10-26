import "materialize-css/dist/css/materialize.min.css";
import React, { Component } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@mui/material/Paper";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Delete, Edit, Save } from "@mui/icons-material";
import { Dialog, Fab } from "@mui/material";

const styles = (theme) => ({
  root: {
    width: "80%",
    margin: "auto",
  },
  localUsers: {
    width: "100%",
    padding: "1%",
    flex: 1,
    marginBottom: "20px",
  },

  left: {
    // float: "none",
    width: "100%",
    paddingLeft: "1%",
    paddingRight: "1%",
    paddingTop: "1%",
    marginBottom: "1%",
    paddingBottom: "1%",
    [theme.breakpoints.up("md")]: {
      // float: "left",
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

class ReqResUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      pageNo: 1,
      totalPages: null,
    };
  }
  render() {
    const { classes } = this.props;
    console.log("page", this.state.pageNo);
    return (
      <Paper elevation={3} className={classes.bottom}>
        <h5>Users list from reqres.in</h5>
        <div style={{ display: "flex", flexDirection: "column" }}>
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
              {this.state.users.map((user) => {
                return (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flex: 1 }} />
            <IconButton
              disabled={this.state.pageNo <= 1}
              onClick={() => this.setPage(this.state.pageNo - 1)}
            >
              <ArrowLeftIcon />
            </IconButton>
            <span>
              Page {this.state.pageNo}/{this.state.totalPages}
            </span>
            <IconButton
              disabled={
                !this.state.totalPages ||
                this.state.pageNo >= this.state.totalPages
              }
              onClick={() => this.setPage(this.state.pageNo + 1)}
            >
              <ArrowRightIcon />
            </IconButton>
          </div>
        </div>
      </Paper>
    );
  }

  componentDidMount() {
    this.loadUsers(this.state.pageNo);
  }

  setPage(pageNo) {
    this.setState({ pageNo: pageNo });
    this.loadUsers(pageNo);
  }

  async loadUsers(pageNo) {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`https://reqres.in/api/users?page=${pageNo}`, config)
      .then((res) => {
        console.log(res.data.data);
        this.setState({
          users: res.data.data,
          totalPages: res.data.total_pages,
          pageNo: res.data.page,
        });
      })
      .catch((err) => console.log(err));
  }
}

class LocalUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      warning: false,
    };
  }

  render() {
    console.log("local users render", this.props.users);
    const { classes, editHandler, deleteHandler, users } = this.props;
    const handleWarning = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      this.setState({ warning: false });
    };
    return (
      <Paper className={classes.localUsers} elevation={3}>
        <h5>Users list from local storage</h5>
        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>JOB</th>
                <th>DELETE</th>
                <th>EDIT</th>
              </tr>
            </thead>
            <tbody>
              {users.map((res) => {
                return (
                  <tr key={res.id}>
                    <td>{res.id}</td>
                    <td>{res.name}</td>
                    <td>{res.job}</td>
                    <td>
                      {
                        <Stack spacing={2} sx={{ width: "55%" }}>
                          <IconButton
                            variant="contained"
                            onClick={() => deleteHandler(res.id)}
                          >
                            <Delete />
                          </IconButton>
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
                        <IconButton
                          variant="contained"
                          className={classes.box}
                          onClick={() => editHandler(res.id)}
                        >
                          <Edit />
                        </IconButton>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Paper>
    );
  }
}

class CreateUserDialog extends Component {
  constructor(props) {
    super(props);
    if (this.props.editedUser) {
      const user = this.props.editedUser;
      this.state = {
        id: user.id,
        name: user.name,
        job: user.job,
      };
    } else {
      this.state = {
        id: "",
        name: "",
        job: "",
      };
    }
  }

  render() {
    const { submitHandler, classes, open, cancelHandler } = this.props;
    // const user = this.state.
    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      this.setState({ open: false });
    };
    return (
      <Dialog open={open}>
        <div style={{ padding: "15px", width: "240px" }}>
          <h5>Create Users</h5>
          <form>
            <div>
              <label>Id : </label>
              <input
                type="text"
                onChange={(e) => this.setState({ id: e.target.value })}
                value={this.state.id}
              />
            </div>
            <div>
              <label>Name : </label>
              <input
                type="text"
                onChange={(e) => this.setState({ name: e.target.value })}
                value={this.state.name}
              />
            </div>
            <div>
              <label>Job : </label>
              <input
                type="text"
                onChange={(e) => this.setState({ job: e.target.value })}
                value={this.state.job}
              />
            </div>
            <div style={{ display: "flex", flexDirecton: "row" }}>
              <span style={{ flex: 1 }} />
              <Button
                color="secondary"
                variant="contained"
                onClick={() => cancelHandler()}
              >
                CANCEL
              </Button>
              <Button
                disabled={!this.state.id || !this.state.name || !this.state.job}
                variant="contained"
                onClick={() =>
                  submitHandler(this.state.id, this.state.name, this.state.job)
                }
                style={{ marginLeft: "10px" }}
              >
                CREATE
              </Button>
            </div>

            <Stack spacing={2} sx={{ width: "25%" }}>
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
                  User has been created successfully!
                </Alert>
              </Snackbar>
            </Stack>
          </form>
        </div>
      </Dialog>
    );
  }
}

class UpdateUserDialog extends Component {
  constructor(props) {
    super(props);
    const user = this.props.editedUser;
    this.state = {
      id: user.id,
      name: user.name,
      job: user.job,
    };
  }

  render() {
    const { submitHandler, classes, open, cancelHandler } = this.props;
    // const user = this.state.
    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      this.cancelHandler();
    };
    return (
      <Dialog open={open}>
        <div style={{ padding: "15px", width: "240px" }}>
          <h5>Update User</h5>
          <form>
            <div>
              <label>Id : </label>
              <input
                type="text"
                disabled={true}
                onChange={(e) => this.setState({ id: e.target.value })}
                value={this.state.id}
              />
            </div>
            <div>
              <label>Name : </label>
              <input
                type="text"
                onChange={(e) => this.setState({ name: e.target.value })}
                value={this.state.name}
              />
            </div>
            <div>
              <label>Job : </label>
              <input
                type="text"
                onChange={(e) => this.setState({ job: e.target.value })}
                value={this.state.job}
              />
            </div>
            <div style={{ display: "flex", flexDirecton: "row" }}>
              <span style={{ flex: 1 }} />
              <Button
                color="secondary"
                variant="contained"
                onClick={() => cancelHandler()}
              >
                CANCEL
              </Button>
              <Button
                disabled={!this.state.id || !this.state.name || !this.state.job}
                variant="contained"
                onClick={() =>
                  submitHandler(this.state.id, this.state.name, this.state.job)
                }
                style={{ marginLeft: "10px" }}
              >
                UPDATE
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    );
  }
}

class RetailerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      showCreateUserDialog: false,
      showUpdateUserDialog: false,
      alerts: [],
    };
  }

  deleteHandler = (id) => {
    console.log(id);
    axios
      .delete(`https://reqres.in/api/users/${id}`)
      .then(() => {
        this.setState({
          users: this.state.users.filter((data) => data.id !== id),
        });
        this.addAlert(
          `User with id ${id} deleted at reqres.in and local storage.`
        );
      })
      .catch((err) => console.log(err));
  };

  createUserHandler = (id, name, job) => {
    const userExists = this.state.users.find((user) => user.id == id);
    if (userExists) {
      this.addAlert(`Error! The user having id ${id} is already present`);
      return;
    }
    axios
      .post("https://reqres.in/api/users", {
        id: id,
        name: name,
        job: job,
      })
      .then(() => {
        this.setState({
          users: [...this.state.users, { id, name, job }].sort(
            (a, b) => a.id - b.id
          ),
          showCreateUserDialog: false,
        });
        this.addAlert(
          `User ${name} created with id ${id} at reqres.in and local storage.`
        );
      })
      .catch((error) => {
        console.log(error);
        this.addAlert(error);
      });
  };

  updateUserHandler = (id, name, job) => {
    const userExists = this.state.users.find((user) => user.id == id);
    if (!userExists) {
      this.addAlert(`Error! User with id ${id} does not exist.`);
      return;
    }
    axios
      .post("https://reqres.in/api/users", {
        id: id,
        name: name,
        job: job,
      })
      .then((res) => {
        const user = this.state.users.find((user) => user.id == id);
        this.setState({
          users: [
            ...this.state.users.filter((user) => user.id != id),
            { id, name, job },
          ].sort((a, b) => a.id - b.id),
          showUpdateUserDialog: false,
        });
        this.addAlert(
          `User ${name} with id ${id} updated at reqres.in and local storage.`
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editHandler = (id) => {
    console.log(id);
    let user = this.state.users.find((res) => {
      return res.id === id;
    });
    this.setState({
      editedUser: { ...user },
      showUpdateUserDialog: true,
    });
  };

  deleteAlert = (alert) => {
    this.setState({
      alerts: [...this.state.alerts.filter((a) => a != alert)],
    });
  };

  addAlert = (alert) => {
    this.setState({
      alerts: [...this.state.alerts, alert],
    });
  };

  render = () => {
    console.log("render called for users");
    console.log(this.state.users);
    console.log("users", this.state.users);
    const { classes } = this.props;
    return (
      <>
        <div className={classes.root}>
          <h3>User Operations Demo App</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "-70px",
              padding: "10px",
            }}
          >
            <span style={{ flex: 1 }} />
            <Fab
              color="primary"
              variant="extended"
              onClick={() => this.setState({ showCreateUserDialog: true })}
              style={{ marginTop: "10px" }}
            >
              <AddIcon /> Add User
            </Fab>
          </div>
          <LocalUsers
            users={this.state.users}
            classes={classes}
            editHandler={this.editHandler}
            deleteHandler={this.deleteHandler}
          />
          <ReqResUsers classes={classes} />
        </div>
        <CreateUserDialog
          cancelHandler={() => this.setState({ showCreateUserDialog: false })}
          submitHandler={this.createUserHandler}
          classes={classes}
          open={this.state.showCreateUserDialog}
        />
        {this.state.showUpdateUserDialog ? (
          <UpdateUserDialog
            cancelHandler={() => this.setState({ showUpdateUserDialog: false })}
            submitHandler={this.updateUserHandler}
            classes={classes}
            open={true}
            key={this.state.editedUser.id}
            editedUser={this.state.editedUser}
          />
        ) : null}

        {this.state.alerts.map((alert) => (
          <Stack spacing={2} sx={{ width: "25%" }}>
            <Snackbar
              open={true}
              autoHideDuration={4000}
              onClose={() => this.deleteAlert(alert)}
            >
              <Alert
                // onClose={handleClose}
                severity="success"
                sx={{ width: "100%" }}
              >
                {alert}
              </Alert>
            </Snackbar>
          </Stack>
        ))}
      </>
    );
  };
}

export default withStyles(styles, { withTheme: true })(RetailerList);

import "materialize-css/dist/css/materialize.min.css";
import React, { Component } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@mui/material/Paper";

const styles = (theme) => ({
  root: {
    width: "100%",
    padding: "1%",
  },
  float: {
    float: "none",
    width: "100%",
    marginRight: "1%",
    paddingLeft: "3%",
    paddingRight: "3%",
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
    },
  },
  left: {
    float: "none",
    width: "100%",
    marginRight: "1%",
    paddingLeft: "3%",
    paddingRight: "3%",
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
    },
  },
  box: {
    marginRight: "2%",
    width: "30%",
  },
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
        window.alert(`User ${id} Deleted Sucessfully!`);
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
        console.log(res);
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
        window.alert(`User Added Sucessfully!`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render = () => {
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
                  <th>id</th>
                  <th>name</th>
                  <th>job</th>
                  <th>createdAt</th>
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
                          <Button
                            variant="contained"
                            className={classes.box}
                            onClick={() => this.deleteHandler(index)}
                          >
                            DELETE
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
              <h5>Users</h5>
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
                <Button variant="contained" onClick={this.submitHandler}>
                  submit
                </Button>
              </form>
            </div>
          </Paper>
        </div>
        <Paper elevation={3}>
          <div>
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>first_name</th>
                  <th>last_name</th>
                  <th>email</th>
                  <th>avatar</th>
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
                      <td>{res.avatar}</td>
                      {/* <td>
                        {
                          <Button
                            variant="contained"
                            className={classes.box}
                            onClick={() => this.deleteHandler(index)}
                          >
                            DELETE
                          </Button>
                        }
                      </td> */}
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

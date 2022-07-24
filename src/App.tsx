import { useState, useEffect } from "react";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const App: React.FC = () => {
  const [users, setUsers] = useState<any>([]);
  const [newUsername, setNewUsername] = useState<any>("");
  const [savedUser, setSavedUser] = useState<any>({});
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    const getUsers = async () => {
      const q = query(usersCollectionRef, orderBy("added_at", "desc"));
      const data = await getDocs(q);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, [savedUser]);

  const saveUser = async (user: any) => {
    await addDoc(usersCollectionRef, user);
    setSavedUser(user);
    toast.success("User saved successfully");
  };

  const searchUser = async (e: any) => {
    e.preventDefault();
    const response = await fetch(`https://api.github.com/users/${newUsername}`);
    if (response.ok) {
      const data = await response.json();
      const user = {
        login: data.login,
        name: data.name,
        public_gists: data.public_gists,
        public_repos: data.public_repos,
        html_url: data.html_url,
        followers: data.followers,
        following: data.following,
        created_at: data.created_at,
        added_at: Timestamp.fromDate(new Date()),
      };
      saveUser(user);
    } else {
      toast.error("User not found");
    }
  };

  return (
    <div className="App">
      <Container maxWidth="xl">
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" align="center">
            Github Username Saver App
          </Typography>
          <form
            onSubmit={(e) => {
              searchUser(e);
            }}
          >
            <TextField
              fullWidth
              label="Github Username"
              variant="outlined"
              margin="dense"
              onChange={(e) => {
                setNewUsername(e.target.value);
              }}
            />
            <div style={{ textAlign: "center", paddingBottom: "20px" }}>
              <Button variant="contained" type="submit">
                Save
              </Button>
            </div>
          </form>
        </Container>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Public Repos</TableCell>
                <TableCell align="right">Public Gists</TableCell>
                <TableCell align="right">Followers</TableCell>
                <TableCell align="right">Following</TableCell>
                <TableCell align="right">Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: any) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link href={user.html_url} target="_blank" rel="noopener">
                      {user.login}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{user.name}</TableCell>
                  <TableCell align="right">{user.public_repos}</TableCell>
                  <TableCell align="right">{user.public_gists}</TableCell>
                  <TableCell align="right">{user.followers}</TableCell>
                  <TableCell align="right">{user.following}</TableCell>
                  <TableCell align="right">{user.created_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default App;

import "./userList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { userRows } from "../../dummyData";
import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {deleteProduct, deleteUser, getProducts, getUsers} from "../../redux/apiCalls";

export default function UserList() {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.user.users);

    useEffect(() => {
        getUsers(dispatch);
    }, [dispatch]);

    const handleDelete = (id) => {
        deleteUser(id, dispatch);
    };

  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    {
      field: "username",
      headerName: "User",
      width: 200,
      renderCell: (params) => {
        return (
            <div className="userListUser">
              {params.row.username}
            </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
  /*  {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "transaction",
      headerName: "Transaction Volume",
      width: 160,
    },*/
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
            <>
              <Link to={"/user/" + params.row._id}>
                <button className="userListEdit">Edit</button>
              </Link>
              <DeleteOutline
                  className="userListDelete"
                  onClick={() => handleDelete(params.row._id)}
              />
            </>
        );
      },
    },
  ];

  return (
      <div className="userList">
        <DataGrid
            rows={users}
            disableSelectionOnClick
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={8}
            checkboxSelection
        />
      </div>
  );
}
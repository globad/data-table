import React, { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import Avatar from "@mui/material/Avatar";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { useGetAllUsersQuery } from "../../services/user";
import { getComparator, stableSort } from "../../utils/utils";
import { Data, Order } from "../../types/users.types";
import { headCells } from "./constants";
import "./users.css";

function TableHeadWithSorting(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <span>{headCell.label}</span>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export const Users = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("firstName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchDebounced] = useDebounce(search, 300);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const { data: usersData, error, isLoading, isFetching } = useGetAllUsersQuery(
    {
      search: searchDebounced,
      page,
      size: rowsPerPage
    }
  );

  const handleChangeSearch = (event) => {
    setPage(0);
    setSearch(event.target.value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderAvatar = (user) => {
    return <Avatar alt={user.firstName} src={user.image} />;
  };

  const renderData: Data[] = useMemo(() => {
    if (usersData) {
      return stableSort(usersData.users, getComparator(order, orderBy)).map(
        (user) => {
          const rowData: Data = { ...user };
          rowData.avatar = () => renderAvatar(user);
          return rowData;
        }
      );
    }

    return [];
  }, [usersData, order, orderBy]);

  if (error) {
    return (
      <div className="message error-mesage">Не удалось получить данные</div>
    );
  }

  if (!usersData) {
    return <div className="message">Нет данных</div>;
  }

  return (
    <div className="page-container">
      <Box
        className="input-container"
        component="form"
        noValidate
        autoComplete="off"
      >
        <TextField
          className="input"
          label="Введите имя"
          variant="outlined"
          onChange={handleChangeSearch}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 750 }}
          className={isLoading || isFetching ? "table-loading" : ""}
        >
          <TableHeadWithSorting
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {renderData.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.avatar()}
                </TableCell>
                <TableCell>{row.firstName}</TableCell>
                <TableCell>{row.lastName}</TableCell>
                <TableCell>{row.birthDate}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.address.address}</TableCell>
                <TableCell>{row.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={usersData?.total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {(isLoading || isFetching) && <div className="loader"></div>}
    </div>
  );
};

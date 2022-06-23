import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import DataTable from "./DataTable";

export default function BookingTable({ bookings, columns }) {
  bookings = bookings.map((l, index) => ({
    ...l,
    id: index + 1,
  }));

  return (
    <DataTable
      data={bookings.map((exercise, index) => ({
        ...exercise,
        index: index + 1,
      }))}
      columns={columns}
    />
  );
}

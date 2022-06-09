import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function DataTable({ data, columns }) {
  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        onSelectionModelChange={(ids) => {
          const selectedIDs = new Set(ids);
          console.log(selectedIDs);
          const selectedRowData = data.filter((row) => selectedIDs.has(row.id));
          console.log(selectedRowData);
        }}
      />
    </div>
  );
}

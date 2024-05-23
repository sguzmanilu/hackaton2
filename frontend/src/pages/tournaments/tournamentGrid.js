import React, { useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DataGrid, {
  Column,
  Grouping,
  FilterRow,
  HeaderFilter,
  FilterPanel,
  Pager,
  Paging,
  ColumnChooser,
  GroupPanel,
  SearchPanel,
  Sorting,
  StateStoring,
  Editing,
  KeyboardNavigation,
} from "devextreme-react/data-grid";

export default function TournamentGrid({ data, handleItemEdit, handleItemDelete, handleItemDetail }) {

  return (
    <DataGrid
      keyExpr="id"
      dataSource={data || []}
      allowColumnReordering={true}
      allowColumnResizing={true}
      columnResizingMode="nextColumn"
    >
      {/* <Grouping
        autoExpandAll={allGroupsExpanded}
      /> */}
      <StateStoring
        enabled={true}
        type="localStorage"
        storageKey={'tournamentGrid'}
      />
      <Sorting mode="multiple" />
      <ColumnChooser
        enabled={true}
        mode="dragAndDrop"
      />
      <GroupPanel visible={true} />

      {/* COLUMNS */}
      <Column dataField="id" caption="id" dataType="number" visible={false} />
      <Column
        dataField="name"
        caption="Nombre"
        dataType="string"
      />
      <Column
        dataField="description"
        caption="Descripción"
        dataType="string"
      />
      <Column
        dataField="owner"
        caption="Creador"
        dataType="string"
        calculateGroupValue={(row) => `${row.owner.name}`}
        calculateCellValue={(row) => `${row.owner.name}`}
        cellRender={(row) => row.data.owner.name}
      />
      <Column
        dataField="total_competitors"
        caption="Total de competidores"
        dataType="number"
      />
      <Column
        dataField="id2"
        caption=""
        width={150}
        dataType="number"
        allowFiltering={false}
        allowSorting={false}
        allowEditing={false}
        allowGrouping={false}
        cellRender={(row) => {
          return (
            <div style={{ display: 'flex', flex: 1, justifyContent: 'space-evenly' }}>
              <IconButton title="Detalle" color="info" onClick={() => handleItemDetail(row.data)}>
                <VisibilityIcon />
              </IconButton>
              <IconButton title="Editar" onClick={() => handleItemEdit(row.data)}>
                <EditIcon />
              </IconButton>
              <IconButton title="Eliminar" onClick={() => handleItemDelete(row.data)}>
                <DeleteIcon />
              </IconButton>
            </div>
          );
        }}
      />

      {/* CONFIG */}
      <FilterRow visible={true} />
      <FilterPanel visible={false} />
      <HeaderFilter visible={true} />
      <SearchPanel visible={true} highlightCaseSensitive={true} />
      <Paging defaultPageSize={50} />
      <Pager
        showPageSizeSelector={true}
        allowedPageSizes={[50, 100, 150, 200]}
        showInfo={true}
      />
    </DataGrid>
  )

}
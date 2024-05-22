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

export default function CompetitorsGrid({ data, handleItemEdit, handleItemDelete, handleItemDetail }) {

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
        storageKey={'competitorsGrid'}
      />
      <Sorting mode="multiple" />
      <ColumnChooser
        enabled={true}
        mode="dragAndDrop"
      />
      <GroupPanel visible={true} />

      {/* COLUMNS */}
      <Column dataField="id" caption="Id" dataType="number"/>
      <Column
        dataField="user"
        caption="Participante"
        dataType="string"
        calculateGroupValue={(row) => `${row.user.name}`}
        calculateCellValue={(row) => `${row.user.name}`}
        cellRender={(row) => row.data.user.name}
      />
      <Column
        dataField="user"
        caption="Usuario Participante"
        dataType="string"
        calculateGroupValue={(row) => `${row.user.username}`}
        calculateCellValue={(row) => `${row.user.username}`}
        cellRender={(row) => row.data.user.username}
      />
      <Column
        dataField="challenges"
        caption="Retos Asignados"
        dataType="number"
      />
      <Column
        dataField="ki_level"
        caption="Nivel de KI"
        dataType="number"
      />
      <Column
        dataField="id"
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
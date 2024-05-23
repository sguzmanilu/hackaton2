import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Grid, Button } from "@mui/material";
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
import { useParams } from "react-router-dom";
import api from "../../utils/api";

export default function ScoreChallengesForm({ handleClose, competitor }) {
    const [challengesAssigned, setChallengesAssigned] = useState([]);
    const [loading, setLoading] = useState(false);

    const { tournamentId } = useParams();

    useEffect(() => {
        if (competitor)
            getChallengesByCompetitor();
    }, [competitor])

    const getChallengesByCompetitor = () => {
        api.Get(`challenge-assign/${competitor.id}`)
            .then((response) => {
                console.log('response.data ', response.data)
                setChallengesAssigned(response.data)
            })
            .catch((e) => {
                toast.error("Error al cargar los retos del participante");
            })
    }

    const onSaved = (e) => {
        const itemChanged = e.changes[0].data;
        console.log('itemChanged ', itemChanged)
        if (itemChanged?.id && itemChanged?.score) {
            const body = {
                tournament: tournamentId,
                competitor: competitor.id,
                challenge: itemChanged.id,
                score: itemChanged.score
            }
            api.Post('challenge-score', body)
                .then((response) => {
                    toast.success("Resultado guardado");
                })
                .catch((e) => {
                    toast.error("Error al guardar el resultado");
                })
        }
    }

    return (
        <Grid container sx={{ marginTop: 1 }}>
            <DataGrid
                keyExpr="id"
                dataSource={challengesAssigned || []}
                allowColumnReordering={true}
                allowColumnResizing={true}
                columnResizingMode="nextColumn"
                onSaved={onSaved}
            >
                <Editing
                    mode="cell"
                    selectTextOnEditStart={true}
                    allowUpdating={true}
                />
                <KeyboardNavigation
                    editOnKeyPress={true}
                    enterKeyDirection={"column"}
                />
                <StateStoring
                    enabled={true}
                    type="localStorage"
                    storageKey={'scoreChallengesGrid'}
                />
                <Sorting mode="multiple" />
                <ColumnChooser
                    enabled={true}
                    mode="dragAndDrop"
                />
                <GroupPanel visible={true} />

                {/* COLUMNS */}
                <Column dataField="id" caption="Id" dataType="number" allowEditing={false} width={100}/>
                <Column
                    dataField="category"
                    caption="Categoría"
                    dataType="string"
                    allowSorting={true}
                    groupIndex={0}
                    allowEditing={false}
                    calculateGroupValue={(row) => `${row.challenge?.category?.name}`}
                    calculateCellValue={(row) => `${row.challenge?.category?.name}`}
                    cellRender={(row) => row.data.challenge?.category?.name}
                />
                <Column
                    dataField="challenge"
                    caption="Reto"
                    dataType="string"
                    allowSorting={true}
                    allowEditing={false}
                    calculateGroupValue={(row) => `${row.challenge?.name}`}
                    calculateCellValue={(row) => `${row.challenge?.name}`}
                    cellRender={(row) => row.data.challenge?.name}
                />
                <Column
                    dataField="score"
                    caption="Resultado"
                    allowFiltering={false}
                    allowSorting={false}
                    dataType="number"
                    allowEditing={true}
                    validationRules={[{ type: 'range', max: 100, min: 0, message: 'El resultado debe estar entre 0 y 100' }]}
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

        </Grid>
    )
}

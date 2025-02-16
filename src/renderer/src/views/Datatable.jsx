import { AddOutlined, Delete, Edit } from "@mui/icons-material"
import { Box, Button, IconButton, Typography } from "@mui/material"
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid"
import FormDialog from "../components/FormDialog.component"
import useApi from "../hooks/useApi"
import { useEffect, useState } from "react"
import ConfirmDialog from "../components/ConfirmDialog.component"
import { useLocation, useNavigate } from "react-router"

export default function Datatable({ entity, readOnly, columns, overrideColumns, data }) {
  const location = useLocation()
  const navigate = useNavigate()
  const createApi = useApi({
    action: "create single",
    entity: entity.name.singular
  })
  const editApi = useApi({
    action: "edit single",
    entity: entity.name.singular
  })
  const deleteApi = useApi({
    action: "delete single",
    entity: entity.name.singular
  })
  const readApi = useApi({
    action: "read many",
    entity: entity.name.singular
  })

  const [open, setOpen] = useState({})

  useEffect(() => {
    console.log("API: ", entity.apiInfo)
    readApi.call(entity.apiInfo || {})
  }, [location.pathname])

  function changeOpen(field, value) {
    setOpen((open) => ({ ...open, [field]: value }))
  }

  function dataGrid() {
    return (
      <DataGrid
        sx={{ borderRadius: "12px" }}
        density="compact"
        columns={
          overrideColumns
            ? columns
            : [
                ...entity.form.map((element) => {
                  return {
                    field: element.field,
                    headerName: element.label,
                    flex: 1,
                    renderCell: ({ row }) => element.getLabel?.(row) || row[element.field],
                    valueFormatter: (value, row) => {
                      if (element.getLabel) {
                        return element.getLabel(row)
                      }

                      return value
                    }
                  }
                }),
                ...(readOnly
                  ? []
                  : [
                      {
                        field: "actions",
                        headerName: "",
                        width: 100,
                        renderCell: ({ row }) => {
                          return (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                                gap: 1,
                                width: "100%",
                                height: "100%"
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  changeOpen("form", { mode: "edit", defaultValue: row })
                                }
                              >
                                <Edit fontSize="small" />
                              </IconButton>

                              <ConfirmDialog
                                button={
                                  <IconButton size="small">
                                    <Delete fontSize="small" />
                                  </IconButton>
                                }
                                title="Are you sure you want to delete this?"
                                description="This action is irreversible, make sure to know what you are doing."
                                onSubmit={async () => {
                                  await deleteApi.call({ params: { id: row.id } })
                                  await readApi.call({})
                                  navigate(0)
                                }}
                              />
                            </Box>
                          )
                        }
                      }
                    ])
              ]
        }
        loading={readApi.loading}
        rows={data || readApi.data || []}
        slots={{ toolbar: CustomToolbar }}
      />
    )
  }

  if (readOnly) {
    return dataGrid()
  }

  return (
    <Box sx={{ p: 3 }}>
      {open.form && (
        <FormDialog
          title={(open.form?.mode == "create" ? "Create " : "Edit ") + entity.name.singular}
          elements={entity.form}
          onSubmit={async (value) => {
            let response
            if (open.form.mode == "create") {
              response = await createApi.call({ body: value })
            } else if (open.form.mode == "edit") {
              response = await editApi.call({
                body: value,
                params: { id: open.form?.defaultValue.id }
              })
            }

            await readApi.call({})

            navigate(0)

            return response
          }}
          defaultValue={open.form?.defaultValue || {}}
          open={open["form"]}
          setOpen={(v) => {
            changeOpen("form", v)
          }}
          submitButtonLabel={"Save"}
        />
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <Typography variant="h5">{entity.name.plural}</Typography>
        <Button
          onClick={() => {
            changeOpen("form", { mode: "create", defaultValue: {} })
          }}
          sx={{ borderRadius: "24px" }}
          variant="contained"
          disableElevation
          startIcon={<AddOutlined />}
        >
          Create {entity.name.singular}
        </Button>
      </Box>

      <br />
      {dataGrid()}
    </Box>
  )
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}

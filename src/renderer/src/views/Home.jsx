import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp"
import { Box, Button } from "@mui/material"
import MuiAccordion from "@mui/material/Accordion"
import MuiAccordionDetails from "@mui/material/AccordionDetails"
import MuiAccordionSummary, { accordionSummaryClasses } from "@mui/material/AccordionSummary"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid"
import * as React from "react"
import { useReactToPrint } from "react-to-print"
import Dropdown from "../components/Dropdown.component"
import entities from "../entities"
import useApi from "../hooks/useApi"
import Datatable from "./Datatable"

const Accordion = styled((props) => (
  <MuiAccordion
    disableGutters
    slotProps={{ transition: { unmountOnExit: true } }}
    elevation={0}
    square
    {...props}
  />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0
  },
  "&::before": {
    display: "none"
  }
}))

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
    transform: "rotate(90deg)"
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1)
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)"
  })
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)"
}))

export default function Home() {
  const [expanded, setExpanded] = React.useState(null)

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  const reports = [
    {
      name: "Countries",
      entity: "Country",

      element: entities.find((e) => e.url == "countries")
    },

    {
      name: "Universities",
      entity: "University",
      api: {
        body: {
          include: {
            diplomas: {
              include: {
                department: true
              }
            },
            country: true
          }
        }
      },
      element: entities.find((e) => e.url == "universities"),
      columns: [
        { headerName: "Name", field: "name", flex: 1 },
        {
          headerName: "Country",
          field: "countryId",
          flex: 1,
          renderCell: ({ row }) => row.country?.name
        },
        {
          headerName: "Diploma Types",
          field: "diplomas1",
          flex: 1,
          renderCell: ({ row }) => row.diplomas?.map((diploma) => diploma.type).join(", ")
        },
        {
          headerName: "Diploma Years",
          field: "diplomas2",
          flex: 1,
          renderCell: ({ row }) => row.diplomas?.map((diploma) => diploma.year).join(", ")
        },
        {
          headerName: "Diploma Departments",
          field: "diplomas3",
          flex: 1,
          renderCell: ({ row }) =>
            row.diplomas?.map((diploma) => diploma.department?.name).join(", ")
        }
      ]
    },
    {
      name: "University",
      entity: "University",
      element: entities.find((e) => e.url == "universities"),
      api: {
        body: {
          include: {
            conventions: {
              include: {
                department: true
              }
            },
            diplomas: {
              include: {
                department: true,
                scholarships: true
              }
            },
            parcours: true
          }
        }
      },
      render: (props) => {
        return <UniversityReport {...props} />
      }
    },

    {
      name: "University with Candidate Students",
      entity: "University",
      element: entities.find((e) => e.url == "universities"),
      render: (props) => {
        return <UniversityStudents {...props} status="Applied" />
      }
    },
    {
      name: "University with Nominee Students",
      entity: "University",
      element: entities.find((e) => e.url == "universities"),
      render: (props) => {
        return <UniversityStudents {...props} status="Nominated" />
      }
    },
    {
      name: "University with Admitted Students",
      entity: "University",
      element: entities.find((e) => e.url == "universities"),
      render: (props) => {
        return <UniversityStudents {...props} status="Accepted" />
      }
    },

    {
      name: "Scholarships",
      entity: "Scholarship",
      element: entities.find((e) => e.url == "scholarships")
    },
    {
      name: "Possible Candidates with Available Scholarships",
      entity: "Student",
      element: entities.find((e) => e.url == "students"),
      api: {
        body: {
          where: {
            applications: {
              some: {
                scholarship: {
                  isNot: null
                }
              }
            }
          },
          include: {
            department: true,
            applications: {
              where: {
                authorized: true,
                scholarship: {
                  isNot: null
                }
              },
              include: {
                scholarship: true
              }
            }
          }
        }
      },
      overrideColumns: true,
      columns: [
        { headerName: "First Name", field: "firstName", flex: 1 },
        { headerName: "Middle Name", field: "middleName", flex: 1 },
        { headerName: "Last Name", field: "lastName", flex: 1 },
        {
          headerName: "Scholarships",
          field: "scholarship",
          flex: 1,
          renderCell: ({ row }) => {
            console.log("ROW: ", row)
            return (
              row.applications
                ?.map((app) => app?.scholarship?.name)
                ?.filter((v) => v)
                ?.join(",") || ""
            )
          }
        }
      ]
    },
    {
      name: "Authorized Candidates",
      entity: "Student",
      element: entities.find((e) => e.url == "students"),
      api: {
        body: {
          where: {
            applications: {
              some: {
                authorized: true,
                scholarship: {
                  isNot: null
                }
              }
            }
          },
          include: {
            department: true,
            applications: {
              where: {
                authorized: true,
                scholarship: {
                  isNot: null
                }
              },
              include: {
                scholarship: true
              }
            }
          }
        }
      },
      overrideColumns: true,
      columns: [
        { headerName: "First Name", field: "firstName", flex: 1 },
        { headerName: "Middle Name", field: "middleName", flex: 1 },
        { headerName: "Last Name", field: "lastName", flex: 1 },
        {
          headerName: "Scholarships",
          field: "scholarship",
          flex: 1,
          renderCell: ({ row }) => {
            console.log("ROW: ", row)
            return (
              row.applications
                ?.map((app) => app?.scholarship?.name)
                ?.filter((v) => v)
                ?.join(",") || ""
            )
          }
        }
      ]
    },
    {
      name: "Admitted Candidates",
      entity: "Student",
      element: entities.find((e) => e.url == "students"),
      api: {
        body: {
          where: {
            applications: {
              some: {
                status: "Accepted"
              }
            }
          },
          include: {
            department: true,
            applications: {
              where: {
                status: "Accepted"
              },
              include: {
                scholarship: true
              }
            }
          }
        }
      }
    },
    {
      name: "Queue",
      entity: "Student",
      element: entities.find((e) => e.url == "students"),
      api: {
        body: {
          where: {
            applications: {
              some: {
                status: "In Queue"
              }
            }
          },
          include: {
            department: true,
            applications: {
              where: {
                status: "In Queue"
              },
              include: {
                scholarship: true
              }
            }
          }
        }
      }
    },
    {
      name: "Boursiers",
      entity: "Student",
      element: entities.find((e) => e.url == "students"),
      api: {
        body: {
          where: {
            applications: {
              some: {
                gottenScholarship: true
              }
            }
          },
          include: {
            department: true
          }
        }
      }
    },
    {
      name: "Students Abroad",
      entity: "Student",
      element: entities.find((e) => e.url == "students"),
      api: {
        body: {
          where: {
            abroad: true
          },
          include: {
            department: true
          }
        }
      }
    },
    {
      name: "Students Abroad in Final Year",
      entity: "Student",
      element: entities.find((e) => e.url == "students"),
      api: {
        body: {
          where: {
            abroad: true,
            year: "5th"
          },
          include: {
            department: true
          }
        }
      }
    },
    {
      name: "Students Abroad M2 and DD in Final Year",
      entity: "Student",
      element: entities.find((e) => e.url == "students"),
      api: {
        body: {
          where: {
            abroad: true,
            year: "5th",
            applications: {
              some: {
                diploma: {
                  OR: [
                    {
                      type: "DD"
                    },
                    {
                      type: "M2R"
                    }
                  ]
                }
              }
            }
          },
          include: {
            department: true,
            applications: {
              where: {
                diploma: {
                  OR: [
                    {
                      type: "DD"
                    },
                    {
                      type: "M2R"
                    }
                  ]
                }
              }
            }
          }
        }
      }
    }
  ]

  return (
    <div>
      {reports.map((report, index) => {
        return (
          <Report
            key={"Report: " + report.name}
            report={report}
            expanded={expanded}
            handleChangeExpanded={handleChange}
          />
        )
      })}
    </div>
  )
}

function UniversityReport({ readApi }) {
  const [selected, setSelected] = React.useState("")
  const options =
    readApi.data?.map((uni) => {
      return {
        value: uni.id,
        label: uni.name
      }
    }) || []

  const university = React.useMemo(() => {
    return readApi.data?.find((uni) => uni.id == selected)
  }, [selected, readApi.data])

  React.useEffect(() => {
    if (options.length > 0 && !selected) {
      setSelected(options[0].value)
    }
  }, [options])

  const diplomaEntity = entities.find((e) => e.url == "diplomas")
  const conventionEntity = entities.find((e) => e.url == "conventions")
  const parcoursEntity = entities.find((e) => e.url == "parcours")

  return (
    <Box>
      <Dropdown
        disableClearable
        options={options}
        label="Select University"
        defaultValue={selected}
        onChange={(newValue) => {
          console.log("New value: ", newValue)
          setSelected(newValue)
        }}
      />
      {university ? (
        <Box p={2}>
          <Typography variant="h4">{university.name}</Typography>

          <br />
          <Typography variant="h6">Diplomas</Typography>
          <DataGrid
            sx={{ borderRadius: "12px" }}
            density="compact"
            columns={[
              ...diplomaEntity.form
                .map((element) => {
                  return {
                    field: element.field,
                    headerName: element.label,
                    flex: 1,
                    renderCell: ({ row }) => element.getLabel?.(row) || row[element.field]
                  }
                })
                .filter((e) => e.field != "universityId")
            ]}
            loading={readApi.loading}
            rows={university.diplomas || []}
            slots={{ toolbar: CustomToolbar }}
          />

          <br />
          <Typography variant="h6">Conventions</Typography>
          <DataGrid
            slots={{ toolbar: CustomToolbar }}
            sx={{ borderRadius: "12px" }}
            density="compact"
            columns={[
              ...conventionEntity.form
                .map((element) => {
                  return {
                    field: element.field,
                    headerName: element.label,
                    flex: 1,
                    renderCell: ({ row }) => element.getLabel?.(row) || row[element.field]
                  }
                })
                .filter((e) => e.field != "universityId")
            ]}
            loading={readApi.loading}
            rows={university.conventions || []}
          />

          <br />
          <Typography variant="h6">Parcours</Typography>
          <DataGrid
            slots={{ toolbar: CustomToolbar }}
            sx={{ borderRadius: "12px" }}
            density="compact"
            columns={[
              ...parcoursEntity.form
                .map((element) => {
                  return {
                    field: element.field,
                    headerName: element.label,
                    flex: 1,
                    renderCell: ({ row }) => element.getLabel?.(row) || row[element.field]
                  }
                })
                .filter((e) => e.field != "universityId")
            ]}
            loading={readApi.loading}
            rows={university.parcours || []}
          />
        </Box>
      ) : null}
    </Box>
  )
}

function UniversityStudents({ readApi, report, status }) {
  const [selected, setSelected] = React.useState("")
  const readStudentsApi = useApi({
    entity: "Student",
    action: "read many"
  })

  const options =
    readApi.data?.map((uni) => {
      return {
        value: uni.id,
        label: uni.name
      }
    }) || []

  const university = React.useMemo(() => {
    return readApi.data?.find((uni) => uni.id == selected)
  }, [selected, readApi.data])

  React.useEffect(() => {
    if (options.length > 0 && !selected) {
      setSelected(options[0].value)
    }
  }, [options])

  React.useEffect(() => {
    console.log("SELECTED UNI: ", selected)

    if (selected)
      readStudentsApi.call({
        body: {
          where: {
            applications: {
              some: {
                status: status || "Applied",
                diploma: {
                  universityId: selected
                }
              }
            }
          },
          include: {
            department: true
          }
        }
      })
  }, [selected])

  const studentEntity = entities.find((e) => e.url == "students")

  return (
    <Box>
      <Dropdown
        disableClearable
        options={options}
        label="Select University"
        defaultValue={selected}
        onChange={(newValue) => {
          console.log("New value: ", newValue)
          setSelected(newValue)
        }}
      />
      {university ? (
        <Box p={2}>
          <Typography variant="h4">{university.name}</Typography>

          <br />
          <Typography variant="h6">Candidate Students</Typography>
          <DataGrid
            sx={{ borderRadius: "12px" }}
            density="compact"
            columns={[
              ...studentEntity.form.map((element) => {
                return {
                  field: element.field,
                  headerName: element.label,
                  flex: 1,
                  renderCell: ({ row }) => element.getLabel?.(row) || row[element.field]
                }
              })
            ]}
            loading={readApi.loading}
            rows={readStudentsApi.data || []}
            slots={{ toolbar: CustomToolbar }}
          />
        </Box>
      ) : null}
    </Box>
  )
}

function Report({ expanded, handleChangeExpanded, report }) {
  const contentRef = React.useRef()
  const reactToPrintFn = useReactToPrint({ contentRef })

  const readApi = useApi({
    entity: report.entity,
    action: report.action || "read many"
  })

  React.useEffect(() => {
    if (expanded === report.name) {
      console.log("API PARAMS: 2", report.api)
      readApi.call(report.api || {})
    }
  }, [expanded])

  console.log(report.name, " - Read api: ", report.api, readApi.data)

  return (
    <Accordion expanded={expanded === report.name} onChange={handleChangeExpanded(report.name)}>
      <AccordionSummary>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 4
          }}
        >
          <Typography component="span">{report.name}</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              alignItems: "center"
            }}
          >
            <Button
              disabled={expanded !== report.name}
              onClick={(e) => {
                e.stopPropagation()
                reactToPrintFn()
              }}
              size="small"
              variant="contained"
            >
              Print
            </Button>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails ref={contentRef}>
        {report.render ? (
          report.render({ readApi, report })
        ) : (
          <Datatable
            readOnly
            entity={entities.find((entity) => entity.name.singular == report.entity)}
            columns={report.columns}
            overrideColumns={report.columns}
            data={readApi.data}
          />
        )}
      </AccordionDetails>
    </Accordion>
  )

  /*<DataGrid
            sx={{ borderRadius: "12px" }}
            density="compact"
            columns={
              report.columns || [
                ...report.element.form.map((element) => {
                  return {
                    field: element.field,
                    headerName: element.label,
                    flex: 1
                  }
                })
              ]
            }
            loading={readApi.loading}
            rows={readApi.data || []}
            slots={{ toolbar: CustomToolbar }}
          /> */
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined"
import { LoadingButton } from "@mui/lab"
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid2,
  Icon,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  TextField
} from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers"
import React, { useEffect, useMemo, useState } from "react"
import Dropzone from "react-dropzone"
import DropHere from "./DropHere.component"
import RadioContainer from "./RadioContainer.component"
import BasicDialog from "./BasicDialog.component"
import Dropdown from "./Dropdown.component"
import useApi from "../hooks/useApi"
import dayjs from "dayjs"

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const phoneRegex = /^\+?[0-9]{1,3}?[-.\s]?(\(?[0-9]{1,4}?\)?)?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/

export default function FormDialog({
  title,
  elements,
  button,
  open,
  setOpen,
  steps,
  defaultValue,
  onSubmit,
  submitButtonLabel,
  onChange
}) {
  const [localOpen, setLocalOpen] = useState(false)
  const [errors, setErrors] = useState({})
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState(defaultValue || {})

  const isFinalStep = !steps || activeStep == steps.length - 1

  const apis = elements.map((element) => {
    return element.apiInfo ? useApi(element.apiInfo) : null
  })

  useEffect(() => {
    apis.map((api) => {
      if (!api?.data) {
        api?.call({})
      }
    })
  }, [apis])

  useEffect(() => {
    if (open !== localOpen) {
      setLocalOpen(open)
    }
  }, [open])

  useEffect(() => {
    if (localOpen) {
      setErrors({})
      setActiveStep(0)
      const initialValue = { ...defaultValue }
      elements.forEach((element) => {
        if (element.formatDefaultData) {
          initialValue[element.field] = element.formatDefaultData(initialValue[element.field])
        }
        if (element.type == "date") {
          initialValue[element.field] = dayjs(new Date(initialValue[element.field]))
        }
      })
      setFormData(initialValue || {})
    }
  }, [localOpen])

  useEffect(() => {
    onChange?.(formData)
  }, [formData])

  async function handleSubmit(event) {
    setLoading(true)
    event.preventDefault()

    const data = formData
    let validationErrors = {}

    elements
      .filter((element) => !steps || element.step == activeStep)
      .forEach((element) => {
        if (element.validate && element.validate(data[element.field]) !== true) {
          validationErrors[element.field] = element.validate(data[element.field])
        }

        if (element.type == "email") {
          if (!emailRegex.test(data[element.field])) {
            validationErrors[element.field] = "Invalid Email"
          }
        }

        if (element.type == "number") {
          if (!Number(data[element.field]) && Number(data[element.field]) != 0) {
            validationErrors[element.field] = "Invalid Number"
          }
        }

        if (element.type == "phone") {
          if (!phoneRegex.test(data[element.field])) {
            validationErrors[element.field] = "Invalid Phone"
          }
        }
      })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
    } else {
      if (!isFinalStep) {
        setActiveStep(activeStep + 1)
      } else {
        const sentData = {}
        elements
          .filter((element) => element.type == "number")
          .forEach((element) => {
            formData[element.field] = Number(formData[element.field])
          })

        elements.forEach((element) => {
          sentData[element.field] = formData[element.field]
        })
        const response = await onSubmit(sentData)

        console.log("RESPONSE: ", response)

        if (response.ok) {
          setLocalOpen(false)
          setOpen?.(false)
        }
      }
      setErrors({})
    }

    setLoading(false)
  }

  function handleChange(field, value) {
    setFormData((formData) => ({ ...formData, [field]: value }))
    const element = elements.find((element) => element.field == field)
    element?.onChange?.(value)
  }

  function generalProps(element) {
    return {
      disabled: element.after && !formData[element.after],
      error: !!errors[element.field],
      helperText:
        element.after && !formData[element.after]
          ? `Select ${elements.find((e) => e.field == element.after)?.label?.toLowerCase()} first`
          : errors[element.field] || ""
    }
  }

  return (
    <>
      {button && (
        <Box
          onClick={() => {
            setLocalOpen(true)
            setOpen?.(true)
          }}
        >
          {button}
        </Box>
      )}

      <BasicDialog
        open={localOpen}
        setOpen={(value) => {
          setLocalOpen(value)
          setOpen?.(value)
        }}
        title={title}
        maxWidth="md"
        actions={
          <>
            {activeStep != 0 && (
              <Button
                onClick={() => {
                  setActiveStep(activeStep - 1)
                }}
                variant="contained"
                color="inherit"
                type="button"
              >
                Back
              </Button>
            )}
            <LoadingButton
              sx={{ borderRadius: "24px" }}
              type="submit"
              variant="contained"
              loading={loading}
            >
              {isFinalStep ? (submitButtonLabel ?? "Submit") : "Next"}
            </LoadingButton>
          </>
        }
        component="form"
        onSubmit={handleSubmit}
      >
        {!!steps && (
          <Stepper
            sx={{
              py: 2,
              px: 2,
              mb: 3,
              backgroundColor: "whitesmoke",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider"
            }}
            activeStep={activeStep}
          >
            {steps.map((label, index) => {
              return (
                <Step key={"Step: " + label + " - index: " + index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              )
            })}
          </Stepper>
        )}
        <Grid2 container spacing={2} pt={steps ? 0 : 0.7}>
          {elements
            .filter((element) => !steps || element.step == activeStep)
            ?.map((element, index) => {
              if (element.type == "image") {
                return (
                  <React.Fragment key={"Element: " + index + element.field}>
                    <Grid2 size="grow" />
                    <Grid2
                      key={"Element: " + index + element.field}
                      container
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        position: "relative"
                      }}
                    >
                      <ImageField
                        handleAdd={(files) => {
                          handleChange(element.field, files[0])
                        }}
                        handleRemove={() => {
                          handleChange(element.field, "")
                        }}
                        src={formData[element.field] || ""}
                      />
                    </Grid2>
                    <Grid2 size="grow" />
                  </React.Fragment>
                )
              }

              if (element.type == "text" || element.type == "email") {
                return (
                  <Grid2 key={"Element: " + index + element.field} size={element.size || 12}>
                    <TextField
                      type={element.type}
                      label={element.label}
                      name={element.field}
                      fullWidth
                      required
                      {...generalProps(element)}
                      value={formData[element.field] || ""}
                      onChange={(e) => handleChange(element.field, e.target.value)}
                      {...(element.props || {})}
                    />
                  </Grid2>
                )
              }

              if (element.type == "number") {
                return (
                  <Grid2
                    key={"Element: " + index + element.field}
                    size={element.size || 12}
                    container
                    alignItems={"center"}
                  >
                    <Grid2 size={element.withInfinite ? "grow" : 12}>
                      <TextField
                        type={
                          element.withInfinite && formData[element.field] == -1
                            ? "text"
                            : element.type
                        }
                        label={element.label}
                        name={element.field}
                        fullWidth
                        required
                        {...generalProps(element)}
                        disabled={element.withInfinite && formData[element.field] == -1}
                        value={
                          element.withInfinite && formData[element.field] == -1
                            ? "Unlimited"
                            : formData[element.field] || ""
                        }
                        onChange={(e) => handleChange(element.field, e.target.value)}
                        {...(element.props || {})}
                      />
                    </Grid2>
                    {element.withInfinite && (
                      <Grid2>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="medium"
                              checked={formData[element.field] == -1}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleChange(element.field, -1)
                                } else {
                                  handleChange(element.field, 0)
                                }
                              }}
                            />
                          }
                          label="Unlimited"
                        />
                      </Grid2>
                    )}
                  </Grid2>
                )
              }

              if (element.type == "phone") {
                return (
                  <Grid2 key={"Element: " + index + element.field} size={element.size || 12}>
                    <TextField
                      type={element.type}
                      label={element.label}
                      name={element.field}
                      fullWidth
                      required
                      {...generalProps(element)}
                      value={formData[element.field] || ""}
                      onChange={(e) => handleChange(element.field, e.target.value)}
                      {...(element.props || {})}
                    />
                  </Grid2>
                )
              }

              if (element.type == "select") {
                return (
                  <Grid2 key={"Element: " + index + element.field} size={element.size || 12}>
                    <Dropdown
                      name={element.field}
                      label={element.label}
                      required
                      textFieldProps={generalProps(element)}
                      disabled={generalProps(element).disabled}
                      options={
                        element.apiInfo
                          ? element.formatApiData(apis[index]?.data) || []
                          : element.options || []
                      }
                      defaultValue={formData[element.field] || ""}
                      onChange={(e) => {
                        handleChange(element.field, e)
                      }}
                      {...(element.props || {})}
                    />
                  </Grid2>
                )
              }

              if (element.type == "date") {
                return (
                  <Grid2 key={"Element: " + index + element.field} size={element.size || 12}>
                    <DateTimePicker
                      name={element.field}
                      label={element.label}
                      slotProps={{
                        textField: {
                          required: true,
                          fullWidth: true,
                          ...generalProps(element)
                        }
                      }}
                      value={formData[element.field] || null}
                      onChange={(e) => handleChange(element.field, e)}
                      {...(element.props || {})}
                    />
                  </Grid2>
                )
              }

              if (element.type == "radio") {
                return (
                  <Grid2 key={"Element: " + index + element.field} size={element.size || 12}>
                    <RadioContainer
                      options={element.options}
                      label={element.label}
                      value={formData[element.field] || ""}
                      onChange={(e) => handleChange(element.field, e)}
                      {...(element.props || {})}
                      defaultValue={"1"}
                    />{" "}
                  </Grid2>
                )
              }

              if (element.type == "custom") {
                return (
                  <Grid2 key={"Element: " + index + element.field} size={element.size || 12}>
                    <React.Fragment key={"Element: " + index + element.field}>
                      {element.render({
                        formData,
                        handleChange
                      })}
                    </React.Fragment>
                  </Grid2>
                )
              }

              if (element.type == "checkbox") {
                return (
                  <Grid2 key={"Element: " + index + element.field} size={element.size || 12}>
                    <FormControlLabel
                      checked={formData[element.field] || ""}
                      onChange={(e) => handleChange(element.field, e.target.checked)}
                      control={<Checkbox />}
                      label={element.label}
                      disabled={generalProps(element).disabled}
                      //{...generalProps(element)}
                    />
                  </Grid2>
                )
              }
            })}
        </Grid2>
      </BasicDialog>
    </>
  )
}

function ImageField({ handleAdd, handleRemove, src }) {
  const [draggingOver, setDraggingOver] = useState(false)

  const url = useMemo(() => {
    if (typeof src == "string") {
      return src
    }

    const localUrl = URL.createObjectURL(src)
    return localUrl
  }, [src])
  return (
    <Dropzone
      noDrag={!!src}
      noClick={!!src}
      noKeyboard={!!src}
      onDragEnter={() => setDraggingOver(true)}
      onDragLeave={() => setDraggingOver(false)}
      onDrop={() => setDraggingOver(false)}
      onDropAccepted={(acceptedFiles) => {
        handleAdd(acceptedFiles)
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Avatar
            variant="rounded"
            src={url}
            sx={{
              width: 200,
              height: 200,
              border: "1px solid",
              borderColor: "divider"
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "secondary.main"
              }}
            >
              <FileUploadOutlinedIcon sx={{ fontSize: "32px" }} />
            </Box>
          </Avatar>
          {!src && (
            <Button
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
              }}
              color="inherit"
              variant="text"
            ></Button>
          )}
          {src && (
            <IconButton onClick={handleRemove} sx={{ position: "absolute", top: 4, right: 4 }}>
              <Icon>close</Icon>
            </IconButton>
          )}
          {draggingOver && <DropHere>Drop Image Here</DropHere>}
        </div>
      )}
    </Dropzone>
  )
}

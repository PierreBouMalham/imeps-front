import { useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"

import entities from "../entities"

const apiMatrix = {
  auth: {
    login: {
      method: "post",
      url: "login"
    },
    register: {
      method: "post",
      url: "register"
    }
  },
  user: {
    "read me": {
      method: "get",
      url: "users/me"
    }
  }
}

entities.forEach((entity) => {
  apiMatrix[entity.name.singular] = {
    "read many": {
      method: "get",
      url: entity.url
    },
    "read single": {
      method: "get",
      url: entity.url + "/:id"
    },
    "create single": {
      method: "post",
      url: entity.url
    },
    "edit single": {
      method: "put",
      url: entity.url + "/:id"
    },
    "delete single": {
      method: "delete",
      url: entity.url + "/:id"
    }
  }
})

console.log("API MATRIX: ", apiMatrix)

const baseUrl = "http://localhost:8000/"

export default function useApi({ action: defaultAction, entity: defaultEntity, callOnMount }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(0)

  async function call({
    params,
    query,
    body,
    files,
    silent,
    action = defaultAction,
    entity = defaultEntity,
    disableToast
  }) {
    console.log("API PARAMS: ", {
      params,
      query,
      body,
      files,
      silent,
      defaultAction,
      defaultEntity,
      disableToast
    })
    console.log("CALLED API: ", action, ", ", entity)
    const settings = apiMatrix[entity]?.[action]
    if (!settings) {
      throw new Error(`API settings for ${entity}.${action} not found.`)
    }

    let url = `${baseUrl}${settings.url}`
    if (params && typeof params === "object") {
      Object.keys(params).forEach((key) => {
        url = url.replace(`:${key}`, params[key])
      })
    }

    if (query && typeof query === "object") {
      const queryString = new URLSearchParams(query).toString()
      url += `?${queryString}`
    }

    const formattedBody = settings.body ? settings.body(body) : body
    let sentData = formattedBody
    if (files) {
      sentData = new FormData()
      files.map((file) => {
        sentData.append("files", file)
      })
      sentData.append("body", JSON.stringify(formattedBody))
    }

    console.log("SENT DATA: ", sentData)

    let response, error, data
    try {
      if (!silent) setLoading((curr) => curr + 1)

      const axiosConfig = {
        method: settings.method == "get" ? "post" : settings.method,
        url,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        data: sentData,
        params: {
          _method: settings.method
        }
      }

      const promise = axios(axiosConfig)
      if (settings.method != "get" && !disableToast) {
        toast.promise(promise, {
          loading: "Loading...",
          success: "Success",
          error: "Unsuccessful"
        })
      }

      response = await promise

      setData(response.data.body ?? response.data)
      setError(null)
      data = response.data.body ?? response.data
    } catch (err) {
      console.log("ERROR :", err)
      response = err.response
      setError(err.response?.data || err.message || "Something went wrong")
      setData(null)
      error = err.response?.data || err.message || "Something went wrong"
    } finally {
      if (!silent) setLoading((curr) => curr - 1)
    }

    return { ok: response?.status < 300 && response?.status >= 200, data, error }
  }

  useEffect(() => {
    if (!data && callOnMount) {
      call(callOnMount === true ? {} : callOnMount)
    }
  }, [])

  return { data, error, loading: Boolean(loading), call, setData, setError }
}

const entities = [
  // STUDENTS
  {
    name: {
      plural: "Students",
      singular: "Student"
    },
    url: "students",
    apiInfo: {
      body: {
        include: {
          department: true
        }
      }
    },
    form: [
      {
        label: "First Name",
        field: "firstName",
        type: "text",
        size: 4
      },
      {
        label: "Middle Name",
        field: "middleName",
        type: "text",
        size: 4
      },
      {
        label: "Last Name",
        field: "lastName",
        type: "text",
        size: 4
      },

      {
        label: "Email",
        field: "email",
        type: "email",
        size: 6
      },
      {
        label: "Phone",
        field: "phone",
        type: "text",
        size: 6
      },
      {
        label: "Branch",
        field: "branch",
        type: "text",
        size: 6
      },
      {
        label: "Year",
        field: "year",
        type: "select",
        options: [
          { value: "1st", label: "1st" },
          { value: "2nd", label: "2nd" },
          { value: "3rd", label: "3rd" },
          { value: "4th", label: "4th" },
          { value: "5th", label: "5th" }
        ],
        size: 6
      },
      {
        label: "Grades",
        field: "grades",
        type: "text",
        size: 4
      },
      {
        label: "Ranking",
        field: "ranking",
        type: "number",
        size: 4
      },
      {
        label: "Average",
        field: "average",
        type: "number",
        size: 4
      },
      {
        label: "Abroad",
        field: "abroad",
        type: "checkbox",
        getLabel: (row) => (row.abroad ? "Yes" : "No")
      },
      {
        label: "Department",
        field: "departmentId",
        type: "select",
        getLabel: (row) => row.department?.name,
        apiInfo: {
          entity: "Department",
          action: "read many",
          callOnMount: true
        },
        formatApiData: (departments) => departments?.map((d) => ({ value: d.id, label: d.name }))
      }
    ]
  },

  // DEPARTMENTS
  {
    name: {
      plural: "Departments",
      singular: "Department"
    },
    url: "departments",
    form: [
      {
        label: "Name",
        field: "name",
        type: "text"
      }
    ]
  },

  // COUNTRIES
  {
    name: {
      plural: "Countries",
      singular: "Country"
    },
    url: "countries",
    form: [
      {
        label: "Name",
        field: "name",
        type: "text"
      }
    ]
  },

  // CONVENTIONS
  {
    name: {
      plural: "Conventions",
      singular: "Convention"
    },
    url: "conventions",
    apiInfo: {
      body: {
        include: {
          department: true,
          university: true
        }
      }
    },
    form: [
      {
        label: "Name",
        field: "name",
        type: "text"
      },
      {
        label: "Year",
        field: "year",
        type: "text"
      },
      {
        label: "URL",
        field: "url",
        type: "text"
      },
      {
        label: "Department",
        field: "departmentId",
        type: "select",
        getLabel: (row) => row.department?.name,
        apiInfo: {
          entity: "Department",
          action: "read many",
          callOnMount: true
        },
        formatApiData: (departments) => departments?.map((d) => ({ value: d.id, label: d.name }))
      },
      {
        label: "University",
        field: "universityId",
        type: "select",
        getLabel: (row) => row.university?.name,
        apiInfo: {
          entity: "University",
          action: "read many",
          callOnMount: true
        },
        formatApiData: (universities) => universities?.map((u) => ({ value: u.id, label: u.name }))
      }
    ]
  },

  // UNIVERSITIES
  {
    name: {
      plural: "Universities",
      singular: "University"
    },
    url: "universities",
    apiInfo: {
      body: {
        include: {
          country: true
        }
      }
    },
    form: [
      {
        label: "Name",
        field: "name",
        type: "text"
      },
      {
        label: "Country",
        field: "countryId",
        type: "select",
        getLabel: (row) => row.country?.name,
        apiInfo: {
          entity: "Country",
          action: "read many",
          callOnMount: true
        },
        formatApiData: (countries) => countries?.map((c) => ({ value: c.id, label: c.name }))
      }
    ]
  },

  // DIPLOMAS
  {
    name: {
      plural: "Diplomas",
      singular: "Diploma"
    },
    url: "diplomas",
    apiInfo: {
      body: {
        include: {
          department: true,
          university: true,
          scholarships: true
        }
      }
    },
    form: [
      {
        label: "Name",
        field: "name",
        type: "text"
      },
      {
        label: "Department",
        field: "departmentId",
        type: "select",
        getLabel: (row) => row.department?.name,
        apiInfo: {
          entity: "Department",
          action: "read many",
          callOnMount: true
        },
        formatApiData: (departments) => departments?.map((d) => ({ value: d.id, label: d.name }))
      },
      {
        label: "Scholarships",
        field: "scholarships",
        type: "select",
        getLabel: (row) => row.scholarships?.map((v) => v.name).join(", "),
        apiInfo: {
          entity: "Scholarship",
          action: "read many",
          callOnMount: true
        },
        formatApiData: (s) => s?.map((d) => ({ value: d.id, label: d.name })),
        formatDefaultData: (s) => s?.map((v) => v.id),
        props: {
          multiple: true,
          required: false
        }
      },
      {
        label: "University",
        field: "universityId",
        type: "select",
        getLabel: (row) => row.university?.name,
        apiInfo: {
          entity: "University",
          action: "read many",
          callOnMount: true
        },
        formatApiData: (universities) => universities?.map((u) => ({ value: u.id, label: u.name }))
      },
      {
        label: "Sur Dossiers",
        field: "surDossiers",
        type: "text"
      },
      {
        label: "Type",
        field: "type",
        type: "select",
        options: [
          { value: "DD", label: "DD" },
          { value: "M2R", label: "M2R" },
          { value: "Echange", label: "Echange" }
        ]
      },
      {
        label: "Year",
        field: "year",
        type: "select",
        options: [
          { value: "1st", label: "1st" },
          { value: "2nd", label: "2nd" },
          { value: "3rd", label: "3rd" },
          { value: "4th", label: "4th" },
          { value: "5th", label: "5th" }
        ]
      },
      {
        label: "Language Level",
        field: "languageLevel",
        type: "text"
      },
      {
        label: "Costs",
        field: "costs",
        type: "text"
      },
      {
        label: "Interview",
        field: "interview",
        type: "checkbox", // or switch
        getLabel: (row) => (row.interview ? "Yes" : "No")
      },
      {
        label: "Oral Exam",
        field: "oralExam",
        type: "checkbox", // or switch
        getLabel: (row) => (row.oralExam ? "Yes" : "No")
      },
      {
        label: "Written Exam",
        field: "writtenExam",
        type: "checkbox", // or switch
        getLabel: (row) => (row.writtenExam ? "Yes" : "No")
      },
      {
        label: "Application Start Date",
        field: "applicationStartDate",
        type: "date"
      },
      {
        label: "Application End Date",
        field: "applicationEndDate",
        type: "date"
      },
      {
        label: "Results Date",
        field: "resultsDate",
        type: "date"
      },
      {
        label: "Procedure",
        field: "procedure",
        type: "text"
      }
    ]
  },

  // PARCOURS
  {
    name: {
      plural: "Parcours",
      singular: "Parcours"
    },
    url: "parcours",
    apiInfo: {
      body: {
        include: {
          university: true
        }
      }
    },
    form: [
      {
        label: "Description",
        field: "description",
        type: "text" // Could be "textarea" if you have a multi-line field
      },
      {
        label: "Type",
        field: "type",
        type: "select",
        options: [
          { value: "DD", label: "DD" },
          { value: "M2R", label: "M2R" },
          { value: "Echange", label: "Echange" }
        ]
      },
      {
        label: "University",
        field: "universityId",
        type: "select",
        getLabel: (row) => row.university?.name,
        apiInfo: {
          entity: "University",
          action: "read many",
          callOnMount: true
        },
        formatApiData: (universities) => universities?.map((u) => ({ value: u.id, label: u.name }))
      }
    ]
  },

  // SCHOLARSHIPS
  {
    name: {
      plural: "Scholarships",
      singular: "Scholarship"
    },
    url: "scholarships",
    form: [
      {
        label: "Name",
        field: "name",
        type: "text"
      },
      {
        label: "Description",
        field: "description",
        type: "text"
      }
    ]
  },

  // APPLICATIONS
  {
    name: {
      plural: "Applications",
      singular: "Application"
    },
    url: "applications",
    apiInfo: {
      body: {
        include: {
          student: true,
          diploma: true,
          scholarship: true
        }
      }
    },
    form: [
      {
        label: "Student",
        field: "studentId",
        type: "select",
        getLabel: (row) => row.student?.firstName + " " + row.student?.lastName,
        apiInfo: {
          entity: "Student",
          action: "read many",
          callOnMount: true
        },
        formatApiData: (students) =>
          students?.map((s) => ({
            value: s.id,
            // You can customize the label to show first + last name
            label: `${s.firstName || ""} ${s.lastName || ""}`.trim()
          }))
      },
      {
        label: "Diploma",
        field: "diplomaId",
        type: "select",
        getLabel: (row) => row.diploma?.name,
        apiInfo: {
          entity: "Diploma",
          action: "read many",
          callOnMount: true
        },
        formatApiData: (diplomas) => diplomas?.map((d) => ({ value: d.id, label: d.name }))
      },
      {
        label: "Created At",
        field: "createdAt",
        type: "date"
      },
      {
        label: "Status",
        field: "status",
        type: "select",
        options: [
          { value: "Applied", label: "Applied" },
          { value: "Nominated", label: "Nominated" },
          { value: "Rejected", label: "Rejected" },
          { value: "Accepted", label: "Accepted" },
          { value: "In Queue", label: "In Queue" }
        ]
      },
      {
        label: "Comment",
        field: "comment",
        type: "text"
      },
      {
        label: "Authorized",
        field: "authorized",
        type: "checkbox",
        getLabel: (row) => (row.authorized ? "Yes" : "No")
      },
      {
        label: "Gotten Scholarship",
        field: "gottenScholarship",
        type: "checkbox",
        getLabel: (row) => (row.gottenScholarship ? "Yes" : "No")
      },
      {
        label: "Scholarship",
        field: "scholarshipId",
        type: "select",
        getLabel: (row) => row.scholarship?.name,
        apiInfo: {
          entity: "Scholarship",
          action: "read many",
          callOnMount: true
        },
        formatApiData: (scholarships) => scholarships?.map((s) => ({ value: s.id, label: s.name }))
      }
    ]
  }
]

export default entities

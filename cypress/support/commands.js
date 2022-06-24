// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import {faker} from "@faker-js/faker";
import {addDays, getDateString} from "../../lib/spec_helper";
import {varToString} from "../../lib/utils";

Cypress.Commands.add('login', (email, password) => {
  cy.visit('http://localhost:3000/')

  // it should automatically redirect to login page
  cy.location('pathname').should('eq', '/login')
  cy.get('[type=email]').type(email)
  cy.get('[type=password]').type(password)

  cy.wait(1500)

  cy.get('button').click()
})

Cypress.Commands.add('generate_leave_requests', () => {
  // 3 leave events
  // first pending, second rejected and third approved
  const rejected_title = faker.lorem.words(6)
  const pending_title = faker.lorem.words(6)
  const approved_title = faker.lorem.words(6)
  const email = faker.internet.email()
  const first_name = faker.name.firstName()
  const last_name = faker.name.lastName()

  const today = new Date().toISOString().slice(0, 10)
  const three_day_from_now = getDateString(addDays(today, 3))
  const five_day_from_now = getDateString(addDays(today, 5))
  const seven_day_from_now = getDateString(addDays(today, 7))
  const nine_day_from_now = getDateString(addDays(today, 9))
  const eleven_day_from_now = getDateString(addDays(today, 11))

  cy.wait(100)

  const list_of_vars = [
    {first_name},
    {last_name},
    {today},
    {three_day_from_now},
    {five_day_from_now},
    {seven_day_from_now},
    {nine_day_from_now},
    {eleven_day_from_now},
    {rejected_title},
    {pending_title},
    {approved_title}
  ]

  list_of_vars.forEach((item) => {
    cy.wrap(Object.values(item)[0]).as(varToString(item))
  })

  const rejected_reason = {
    "id": "1",
    "type": "reply",
    "attributes": {
      "id": 1,
      "reason": "bad reason"
    }
  }

  const accepted_reason = {
    "id": "2",
    "type": "reply",
    "attributes": {
      "id": 2,
      "reason": "good reason"
    }
  }

  const user = {
    "id": "1",
    "type": "user",
    "attributes": {
      "id": 1,
      "email": email,
      "role": "admin",
      "first_name": first_name,
      "last_name": last_name,
      "start_date": "2014-04-23",
      "leave_request_days_count": 7,
      "sick_leave_balance": 5,
      "paid_leave_balance": 18.0,
      "unpaid_leave_balance": 25,
      "status": "disabled",
      "active_salary": null
    }
  }

  const rejected_leave = {
    "id": "2",
    "type": "leave_request",
    "attributes": {
      "id": 2,
      "title": rejected_title,
      "status": "rejected",
      "start_date": today,
      "end_date": three_day_from_now,
      "leave_type": "sick_leave"
    },
    "relationships": {
      "user": {
        "data": {
          "id": "1",
          "type": "user"
        }
      },
      "reply": {
        "data": {
          "id": "1",
          "type": "reply"
        }
      }
    }
  }

  const approved_leave = {
    "id": "3",
    "type": "leave_request",
    "attributes": {
      "id": 3,
      "title": approved_title,
      "status": "approved",
      "start_date": five_day_from_now,
      "end_date": seven_day_from_now,
      "leave_type": "sick_leave"
    },
    "relationships": {
      "user": {
        "data": {
          "id": "1",
          "type": "user"
        }
      },
      "reply": {
        "data": {
          "id": "2",
          "type": "reply"
        }
      }
    }
  }

  const pending_leave = {
    "id": "1",
    "type": "leave_request",
    "attributes": {
      "id": 1,
      "title": pending_title,
      "status": "pending",
      "start_date": nine_day_from_now,
      "end_date": eleven_day_from_now,
      "leave_type": "sick_leave"
    },
    "relationships": {
      "user": {
        "data": {
          "id": "1",
          "type": "user"
        }
      }
    }
  }

  const leave_requests = {
    data: {
      data: [
        rejected_leave,
        pending_leave,
        approved_leave
      ],
      included: [
        rejected_reason,
        accepted_reason,
        user,
      ],
    },
    total: 3
  }

  return cy.wrap(leave_requests)
})

Cypress.Commands.add('get_calendar_title_date', () => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date = new Date()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  const date_title = `${month} ${year}`

  return cy.wrap(date_title)
})

Cypress.Commands.add('created_leave_request_response', (start_date, end_date = null) => {
  end_date = end_date ? end_date : start_date
  const created_leave_request_response = {
    "data": {
      "id": "22",
      "type": "leave_request",
      "attributes": {
        "id": 22,
        "title": "head hurts",
        "status": "pending",
        "start_date": start_date,
        "end_date": end_date,
        "leave_type": "sick_leave"
      },
      "relationships": {"user": {"data": {"id": "16", "type": "user"}}, "reply": {"data": null}}
    },
    "included": [{
      "id": "16",
      "type": "user",
      "attributes": {
        "id": 16,
        "email": "dit.subas@gmail.com",
        "role": "admin",
        "first_name": "Cara",
        "last_name": "Casper",
        "start_date": "2016-11-04",
        "leave_request_days_count": 27,
        "sick_leave_balance": 5,
        "paid_leave_balance": 18.0,
        "unpaid_leave_balance": 25,
        "status": "active",
        "active_salary": null
      }
    }]
  }

  return cy.wrap(created_leave_request_response)
})


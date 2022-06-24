describe('Navigation to admin page', () => {
  context("As normal user", () => {
    beforeEach('login as normal user', () => {
      cy.login('sagar1@gmail.com', 'foobar')
    })
    it("should not be able to navigate to admin page", () => {

      cy.get('[href="/admin"]').should('not.exist')

      // navigate without pressing on link
      cy.request('http://localhost:3000/admin')
      cy.location('pathname').should('eq', '/')
    })

    context('Navigation to calendar page', () => {
      beforeEach('click calendar', () => {
        cy.get('[href="/calendar"]').should('exist').click()
      })

      it("should be able to navigate to calendar page", () => {
        cy.location('pathname').should('eq', '/calendar')

        // assert calendar page is showing correct title
        cy.get_calendar_title_date(title => cy.contains(title))
      })

      it("should be able to create single day leave request", () => {
        // click on next month button random number of time
        const click_times = parseInt(Math.random() * 15 + 1) // choose number between 1 and 15
        for (let i = 0; i < click_times; i++) {
          cy.get('.fc-next-button.fc-button.fc-button-primary').click()
        }
        // now we are in random month lets assert we can create leave request

        const today = new Date()
        const leave_month = (today.getMonth() + click_times) % 12
        const leave_year = today.getFullYear() + parseInt((today.getMonth() + click_times) / 12)
        const leave_day = parseInt(Math.random() * 28 + 1)
        const leave_date = new Date(leave_year, leave_month, leave_day).toISOString().slice(0, 10)

        // for a single day
        const random_calendar_box = parseInt(Math.random() * 28 + 1) // choose number between 1 and 28

        cy.get(`.fc-daygrid-day`).eq(random_calendar_box).click()

        cy.created_leave_request_response(leave_date).then((created_leave_request_response) => {
          // prevent from staining database
          cy.intercept('POST', '**/leave_requests.json**', created_leave_request_response)
          // for now lets assume only freshly created data will be returned...
          cy.intercept('GET', '**/leave_requests.json**', {
            data: {
              data: [created_leave_request_response["data"]]
            },
            total: 1
          })
        })


        cy.get('input').first().type('head hurts')
        cy.get('.py-4 > :nth-child(1) > .inline-block').click() // submit button

        cy.get('.text-lg').should('not.exist') // New leave request
        cy.get('.fc-event-title-container').should('be.visible') // head hurts leave event
      })

      it("should be able to create multi day leave request", () => {
        // click on next month button random number of time
        const click_times = parseInt(Math.random() * 15 + 1) // choose number between 1 and 15
        for (let i = 0; i < click_times; i++) {
          cy.get('.fc-next-button.fc-button.fc-button-primary').click()
        }
        // now we are in random month lets assert we can create leave request

        const today = new Date()
        const leave_month = (today.getMonth() + click_times) % 12
        const leave_year = today.getFullYear() + parseInt((today.getMonth() + click_times) / 12)
        const leave_day = parseInt(Math.random() * 28 + 1)
        const leave_date = new Date(leave_year, leave_month, leave_day).toISOString().slice(0, 10)

        // for a single day
        const random_calendar_box = parseInt(Math.random() * 28 + 1) // choose number between 1 and 28

        cy.created_leave_request_response(leave_date).then((created_leave_request_response) => {
          // prevent from staining database
          cy.intercept('POST', '**/leave_requests.json**', created_leave_request_response)
          // for now lets assume only freshly created data will be returned...
          cy.intercept('GET', '**/leave_requests.json**', {
            data: {
              data: [created_leave_request_response["data"]]
            },
            total: 1
          })
        })

        cy.get(`.fc-daygrid-day`)
          .first()
          .trigger('mousedown', {which: 1, button: 0})
          .trigger('mousemove', {pageX: 700, pageY: 700, clientX: 700, clientY: 700, which: 1})
          .trigger('mouseup', {which: 1})



        cy.get('input').first().type('head hurts')
        cy.get('.py-4 > :nth-child(1) > .inline-block').click() // submit button

        cy.get('.text-lg').should('not.exist') // New leave request
        cy.get('.fc-event-title-container').should('be.visible') // head hurts leave event
      })
    })
  })


})

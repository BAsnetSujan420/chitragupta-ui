describe('As an admin', () => {
  beforeEach('login', () => {
    cy.login('dit.subas@gmail.com', 'foobar')
  })

  context("navigation", () => {
    it("should be able to navigate to admin page", () => {


      // assert admin is present in breadcrumb
      cy.contains('Admin')

      cy.get('[href="/admin"]').click()
      cy.contains('User')
      cy.contains('Salary')
      cy.contains('Salary Records')
    })
  })

  context('Navigation to calendar page as an admin', () => {
    beforeEach('go to calendar page', () => {
      cy.contains('Calendar')
      cy.get('[href="/calendar"]').click()

      // assert next month button is showing
      cy.get('.fc-next-button.fc-button.fc-button-primary').should('be.visible')
    })
    it("should be able to navigate to calendar page", () => {
      // assert calendar page is showing correct title
      cy.get_calendar_title_date(title => cy.contains(title))
      // })


      // for multiple day
      // const dataTransfer = new DataTransfer()
      // cy.get('.fc-daygrid-day').first().trigger('dragstart', {
      //   dataTransfer
      // })
      //
      // cy.get('.fc-daygrid-day').eq(4).trigger('drop', {
      //   dataTransfer
      // })

      // cy.get('.fc-event-title-container').should('be.visible')
      //
      // cy.get('.fc-event-title-container').first().click()
      //
      // cy.contains('Sick Leave Balance')
      // cy.contains('Paid Leave Balance')
      // cy.contains('Unpaid Leave Balance')
      //
      // cy.contains('Leave Type')
      // cy.contains('Reason')
      // cy.contains('Reply')
      //
      // cy.contains('Reject')
      // cy.contains('Approve')
      //
      // // when reject or approve is clicked without reply
      // cy.get('.bg-red-500').click()
      // cy.contains('reply')
      // cy.contains("can't be blank")
    })

    it('should be able to create single day leave request', () => {
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
  })

  context('Navigation to dashboard page as an admin', () => {
    beforeEach('generate leave events', () => {
      cy.generate_leave_requests().then(leave_requests => {
        cy.server()
        cy.route('GET', '**/leave_requests.json?**', leave_requests)
      })
    })

    it("should list all the leave requests", () => {
      // by default we will be in dashboard page
      // all the wrapped variables string starting with @ is initialized in beforeEach in cypress commands.js
      cy.get('@first_name').then((firstName) => {
        cy.get('@last_name').then(lastName => {
          cy.contains(`${firstName} ${lastName}`)
        })
      })

      // assert all the days are present in dashboard page
      const wrapped_vars =
        [
          '@today',
          '@three_day_from_now',
          '@five_day_from_now',
          '@seven_day_from_now',
          '@nine_day_from_now',
          '@eleven_day_from_now',
          '@pending_title',
          '@approved_title',
          '@rejected_title'
        ]

      wrapped_vars.forEach(item => {
        cy.get(item).then(context => {
          cy.contains(context)
        })
      })
      // contains all three status as we have created them
      const statuses = ['rejected', 'approved', 'pending']

      statuses.forEach(item => {
        cy.contains(item)
      })
    })
  })
})

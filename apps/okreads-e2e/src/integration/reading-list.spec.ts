describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I shoud add and remove book in my reading list ', () => {
    cy.get('input[type="search"]').type('Java');
    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1)
    .then(
      () => {
        cy.get('[data-testing="button-add-reading-list"]').first().click().then(() => {
          cy.get('[data-testing="toggle-reading-list"]').click();
          cy.get('[data-testing="reading-list-item"]').should('have.lengthOf.at.least', 1).then(() => {
            cy.get('[data-testing="button-remove-reading-list"]').first().click().then(() => {
              cy.get('[data-testing="reading-list-item"]').should('have.length.lessThan', 1);
            });
          });
        }); 
      }
    );
  })

  it('Then: I shoud undo my last reading book in the list', () => {
    cy.get('input[type="search"]').type('C++');
    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1)
    .then(
      () => {
      cy.get('[data-testing="button-add-reading-list"]').first().click().then(() => {
        cy.get('.mat-button-wrapper').should(
          'contain.text',
          'Undo'
        ).then(() => {
          cy.get('.mat-snack-bar-container').find('button').click();
        });
      });
     })
  })

  it('Then: I shoud finish the reading from my reading list ', () => {
    cy.get('input[type="search"]').type('Java');
    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1)
    .then(
      () => {
        cy.get('[data-testing="button-add-reading-list"]').first().click().then(() => {
          cy.get('[data-testing="toggle-reading-list"]').click();
          cy.get('[data-testing="reading-list-item"]').should('have.lengthOf.at.least', 1).then(() => {
            cy.get('[data-testing="finish-reading"]').first().click().then(() => {
              cy.get('.finish-date').should(
                'have.length',
                1
              )
            });
          });
        }); 
      }
    );
  })

});

describe("Auth flow", () => {
  const url = "http://localhost:3000";
  const testUser = {
    firstName: "Test",
    lastName: "User",
    email: `testuser${Date.now()}@example.com`,
    password: "TestPassword123!",
  };

  it("Tests the authentication flow", () => {
    // Register
    cy.visit(`${url}/register`);
    cy.get("#first_name").type(testUser.firstName);
    cy.get("#last_name").type(testUser.lastName);
    cy.get("#email").type(testUser.email);
    cy.get("#password").type(testUser.password);
    cy.get("#confirm_password").type(testUser.password);
    cy.get("button[type='submit']").click();

    // Should be logged in, go to account page
    cy.visit(`${url}/account`);
    cy.get("#first_name").should("have.value", testUser.firstName);
    cy.get("#last_name").should("have.value", testUser.lastName);
    cy.get("#email").should("have.value", testUser.email);

    // Change password
    const newPassword = "NewPassword123!";
    cy.get("#current_password").type(testUser.password);
    cy.get("#new_password").type(newPassword);
    cy.get("#confirm_password").type(newPassword);
    cy.get("#update-password").click();
    cy.contains("Password updated successfully.").should("be.visible");

    // Logout
    cy.get("form[action='/logout'] button[type='submit']").click();
    cy.url().should("include", "/login");

    // Verify login fails with old password
    cy.visit(`${url}/login`);
    cy.get("#email").type(testUser.email);
    cy.get("#password").type(testUser.password);
    cy.get("button[type='submit']").click();
    cy.contains("Invalid email or password.").should("be.visible");

    // Update testUser password for future logins
    testUser.password = newPassword;

    // Login again
    cy.get("#email").type(testUser.email);
    cy.get("#password").type(testUser.password);
    cy.get("button[type='submit']").click();

    // Delete account
    cy.visit(`${url}/account`);
    cy.get("form[action='/account/delete'] button[type='submit']").click();
    cy.on("window:confirm", () => true);
    cy.url().should("include", "/register");

    // Verify login fails after deletion
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type(testUser.email);
    cy.get("#password").type(testUser.password);
    cy.get("button[type='submit']").click();
    cy.contains("Invalid email or password.").should("be.visible");
  });
});

const rentalService = require("../services/rentals_service");

exports.getRentals = function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const userId = req.session.user.customer_id;
  rentalService.getRentalsByUserId(userId, (err, rentals) => {
    if (err) {
      return next(err);
    }

    const now = new Date();
    const rentalsWithReturned = rentals.map((rental) => {
      let returned = false;
      if (rental.return_date) {
        const returnedDate = new Date(rental.return_date);
        returned = returnedDate <= now;
      }
      return { ...rental, returned };
    });

    res.render("rentals", { rentals: rentalsWithReturned });
  });
};

exports.createRental = function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const userId = req.session.user.customer_id;
  const { film_id } = req.body;

  rentalService.createRental(userId, film_id, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/rentals");
  });
};

exports.returnRental = function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const userId = req.session.user.customer_id;
  const rentalId = req.params.id;

  rentalService.returnRental(userId, rentalId, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/rentals");
  });
};

module.exports = app => {
  var router = require("express").Router();
  const auth = require('./middleware/auth');

  const genre = require("./controllers/genre-controller");
  const artist = require("./controllers/artist-controller");
  const track = require("./controllers/track-controller");
  const favourite = require("./controllers/favourite-controller");
  const user = require("./controllers/user-controller");
  const admin = require("./controllers/admin-controller");
  const review = require("./controllers/review-controller");
  const info = require("./controllers/information-controller");

  // Authenticated functions
  router.post("/user", auth, user.update);
  router.post("/favourites", auth, favourite.create);
  router.get("/favourites/user", auth, favourite.findAuthorizedUserPlaylists);
  router.put("/favourites/:id", favourite.update);
  router.delete("/favourites/:id", favourite.delete);

  router.delete("/information/:id", auth, info.delete);
  router.post("/information", auth, info.create);
  router.put("/information/:id", auth, info.update);

  router.get("/users", user.findAll);

  router.put("/reviews/:id", review.update);
  router.delete("/reviews/:id", review.delete);
  router.post("/reviews", review.create);

  // Unauthenticated functions
  router.post("/signup", user.create);
  router.post("/login", user.login);

  router.get("/genres", genre.findAll);

  router.get("/information", info.findAll);

  router.get("/artists/:id", artist.findOne);
  router.get("/artists", artist.findIds);

  router.get("/tracks/:id", track.findOne);
  router.post("/tracks/search", track.search);

  router.get("/favourites", favourite.findAll);
  router.get("/favourites/first-ten", favourite.findFirstTen);
  router.get("/favourites/name/:name", favourite.findOne);
  router.get("/favourites/name/:name/detail", favourite.findOneDetail);

  router.get("/reviews", review.findAll);
  router.get("/reviews/:user_id/", review.getByUserId);
  router.get("/reviews/:fav_id/playlists", review.getByPlaylist);

// Administrator Functionality
// Note: Users who are admin have is_admin=true
  router.put("/admin/user-status/:user_id", auth, admin.updateUserStatus);
  router.put("/admin/user-privilege/:user_id", auth, admin.updateUserPrivileges);
  router.put("/admin/review/:review_id", auth, admin.updateReviewVisibilityFlag);

  app.use('/api', router);
};
const Listing = require("../models/listing.js");
const axios = require("axios");
async function getCoordinates(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    location
  )}`;
  const response = await axios.get(url, {
    headers: { "User-Agent": "YourAppName/1.0" },
  });
  if (response.data && response.data.length > 0) {
    const { lat, lon } = response.data[0];
    return { latitude: lat, longitude: lon };
  } else {
    throw new Error("Location not found");
  }
}

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  // console.log(allListings.length);
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  // console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  let response = await getCoordinates(req.body.listing.location);
  console.log(response); // { latitude: '28.6139391', longitude: '77.2090212' }
  //handling server side errors(which may occur while sending request from hopscotch or thunderclient)
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send valid data for listing");
  // }
  // console.log(req.body.listing);
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, filename);
  const newListing = new Listing(req.body.listing);

  // if (!newListing.title) {
  //   throw new ExpressError(400, "Description is missing");
  // }
  // if (!newListing.description) {
  //   throw new ExpressError(400, "Description is missing");
  // }
  // if (!newListing.location) {
  //   throw new ExpressError(400, "Description is missing");
  // }
  //this type of error handling requires a lot of effort therefore we use joi , an npm package

  // let result = listingSchema.validate(req.body);
  // console.log(result);
  // if (result.error) {
  //   throw new ExpressError(400, result.error);
  // }
  // console.log(req.user._id);
  newListing.owner = req.user._id;
  newListing.image = { url, filename }; // multer is used to handle file uploads
  newListing.coordinates = response;
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New listing created successfully!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  //handling server side errors(which may occur while sending request from hopscotch or thunderclient)
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect("/listings");
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

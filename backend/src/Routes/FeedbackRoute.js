import express from "express";
import FeedbackController from "../Controller/FeedbackController.js";

const route = express.Router();

route.post("/fcreate", FeedbackController.fcreate);
route.get("/fgetAll", FeedbackController.fgetAll);
route.post("/fdelete", FeedbackController.fdelete);

export default route;
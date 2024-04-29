import Feedback from "../Modal/Feedback.js";


class FeedbackController {

    //Create Stock
  fcreate = async (req, res) => {
    try {
      const feedbackData = new Feedback(req.body);

      if (!feedbackData) {
        return res.status(404).json({ msg: "Feedback data not found" });
      }

      const savedData = await feedbackData.save();
      res.status(200).json(savedData);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  //Get All feedbacks
  fgetAll = async (req, res) => {
    try {
      const feedbackData = await Feedback.find();
      if (!feedbackData) {
        return res.status(404).json({ msg: "Feedback data not found" });
      }
      res.status(200).json(feedbackData);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  //Delete feedbacks
  fdelete = async (req, res) => {
    try {
      const id = req.body.id;
      const feedbackExist = await Feedback.findById(id);
      if (!feedbackExist) {
        return res.status(404).json({ msg: "Feedback not found" });
      }
      await Feedback.findByIdAndDelete(id);
      res.status(200).json({ msg: "Feedback deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };







}

export default new FeedbackController();
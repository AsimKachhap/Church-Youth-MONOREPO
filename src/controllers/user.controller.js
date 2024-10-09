import { UserDetails } from "../models/userDetails.model.js";

export const collectUserDetails = async (req, res) => {
  const userId = await req.params.id;
  console.log("Collecting User Details");
  res.send(`I will collect your details -> ${userId}`);
};

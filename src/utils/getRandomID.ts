import axios from "axios";

export default async function getRandomID() {
  const { data } = await axios.get("/api/randomId");

  return data.randomID as string;
}
